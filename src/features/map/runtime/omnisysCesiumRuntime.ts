"use client";

import * as Cesium from "cesium";
import { OmnisysCesium, type MapSourcesConfig } from "omnisys_cesium_lib";
import { ViewerManager } from "omnisys_cesium_lib/dist/services/viewerManager";
import { positionActiveService } from "omnisys_cesium_lib/dist/modules/components/services/positionActiveService";
import { Marker } from "omnisys_cesium_lib/dist/shapes/marker/types/marker";
import { MapEntityTypeEnum } from "omnisys_cesium_lib/dist/enums/mapEntitiesEnum";
import { DrawerShapesEnum } from "omnisys_cesium_lib/dist/enums/drawerShapesEnum";
import type {
  EnemyRouteShapeOptions,
  FriendlyRadarShapeOptions,
  GeoPointShapeOptions,
  OperationalGeoShapeOptions,
  OmnisysCesiumInitOptions,
  OmnisysStartLocation,
} from "@/types/mapRuntime";
import generatedMapSourcesConfig from "@/config/mapSources.generated.json";

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

export type OmnisysCesiumInstance = InstanceType<typeof OmnisysCesium>;
export type MapRuntimeInstance = OmnisysCesiumInstance;

type OmnisysWithRadarComplexShape = {
  createRadarComplexShape?: (options?: Record<string, unknown>) => Promise<unknown>;
};

type OmnisysWithRouteComplexShape = {
  createRouteComplexShape?: (options?: Record<string, unknown>) => Promise<unknown>;
};

type OmnisysWithPolygon = {
  createPolygon?: (options?: Record<string, unknown>) => Promise<unknown>;
};

type OmnisysWithEventBus = {
  getEventBus?: () => {
    on: (name: string, listener: (event: unknown) => void) => (event: unknown) => void;
    removeListener: (name: string, listener: (event: unknown) => void) => void;
  };
};

let activeRuntimeInstance: MapRuntimeInstance | null = null;
const mapEventFallbackListeners = new WeakMap<object, (event: unknown) => void>();

// Tracks the Cesium entity IDs that were placed via the Geo → GeoPoint menu.
// Used to identify GeoPoint entities when the user clicks them on the map.
const geoPointEntityIds = new Set<string>();

// Dispatched on window when the user clicks a GeoPoint entity on the map.
export const GEO_POINT_SELECTED_EVENT = "omnisod:geopoint-selected" as const;
export const GEO_POINT_DESELECTED_EVENT = "omnisod:geopoint-deselected" as const;

export type GeoPointSelectedEventDetail = { id: string; name: string };

type EditableShape = {
  id?: string;
  name?: string;
  mapEntities?: Array<{ id?: string }>;
};

// Tracks the shape currently open in ShapeEditorUI so we can sync the name
// to the Cesium entity label after the user clicks Save.
let _currentEditingShape: EditableShape | null = null;
let _positionSub: { unsubscribe: () => void } | null = null;
let _actionSub: { unsubscribe: () => void } | null = null;

// Holds the icon & color selected from the sidebar menu so we can apply it
// immediately when the entity first enters editing mode (position$ fires),
// instead of waiting until the user clicks Save.
let _pendingEntityIconPath: string | null = null;
// Timer used to defer our icon override to AFTER the library's own
// synchronous applyStyle()/color logic runs following each position$ event.
let _pendingApplyTimer: ReturnType<typeof setTimeout> | null = null;

function syncEntityLabelToName(shape: EditableShape): void {
  const newName = shape.name ?? "";

  // Update main entity
  const mainEntity = ViewerManager.getById(shape.id ?? "");
  if (mainEntity) {
    mainEntity.name = newName;
    if (mainEntity.label?.text) {
      mainEntity.label.text = new Cesium.ConstantProperty(newName);
    }
  }

  // Update marker sub-entities inside a ComplexFeature (e.g. route/radar)
  for (const part of shape.mapEntities ?? []) {
    if (!part?.id) continue;
    const partEntity = ViewerManager.getById(part.id);
    if (!partEntity) continue;
    partEntity.name = newName;
    if (partEntity.label?.text) {
      partEntity.label.text = new Cesium.ConstantProperty(newName);
    }
  }
}

function initLabelSyncSubscriptions(): void {
  if (_positionSub && _actionSub) return; // already set up

  _positionSub = positionActiveService.position$.subscribe((val: unknown) => {
    if (val && typeof val === "object" && "position" in val) {
      const posData = (val as { position?: { shape?: EditableShape } }).position;
      if (posData?.shape) {
        _currentEditingShape = posData.shape;

        // Apply the sidebar-selected icon to the entity as soon as it enters
        // editing mode (i.e. the user has clicked the map to place it but
        // before they click Save). Without this the library's default icon is
        // shown until Save is clicked.
        //
        // IMPORTANT: the library runs its own applyStyle()/color logic
        // synchronously AFTER position$ fires, which would overwrite any
        // direct billboard assignment we make here. We therefore defer the
        // override with setTimeout(0) so it runs after the library's call
        // stack has fully completed.
        if (_pendingEntityIconPath) {
          const iconPath = _pendingEntityIconPath;
          const shapeId = posData.shape.id ?? "";
          const shapeParts = [...(posData.shape.mapEntities ?? [])];

          if (_pendingApplyTimer !== null) {
            clearTimeout(_pendingApplyTimer);
          }
          _pendingApplyTimer = setTimeout(() => {
            _pendingApplyTimer = null;

            const applyIcon = (entityId: string) => {
              const entity = ViewerManager.getById(entityId);
              if (entity?.billboard) {
                entity.billboard.image = new Cesium.ConstantProperty(iconPath);
                entity.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
                entity.billboard.scale = new Cesium.ConstantProperty(0.7);
                entity.billboard.verticalOrigin = new Cesium.ConstantProperty(Cesium.VerticalOrigin.CENTER);
                entity.billboard.horizontalOrigin = new Cesium.ConstantProperty(Cesium.HorizontalOrigin.CENTER);
                entity.billboard.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(0, 0));
              }
            };

            if (shapeId) applyIcon(shapeId);
            for (const part of shapeParts) {
              if (part?.id) applyIcon(part.id);
            }
          }, 0);
        }
      }
    } else {
      _currentEditingShape = null;
    }
  });

  _actionSub = positionActiveService.action$.subscribe(
    (event: { action: "save" | "cancel"; data?: unknown }) => {
      if (event?.action === "save" && _currentEditingShape) {
        // shape.name is already updated synchronously by ShapeEditorUI before
        // action$ fires, so we can read the new value immediately.
        syncEntityLabelToName(_currentEditingShape);
      }
    }
  );
}

let _entityClickInitialized = false;

function initEntityClickTracking(): void {
  if (_entityClickInitialized) return;

  const viewerManagerRaw = ViewerManager as unknown as { viewer?: Cesium.Viewer };
  const viewer = viewerManagerRaw.viewer;
  if (!viewer) {
    // Viewer not ready yet — retry after Cesium finishes initialising.
    setTimeout(initEntityClickTracking, 150);
    return;
  }

  _entityClickInitialized = true;

  viewer.selectedEntityChanged.addEventListener((entity: Cesium.Entity | undefined) => {
    if (!entity) {
      window.dispatchEvent(new CustomEvent(GEO_POINT_DESELECTED_EVENT));
      return;
    }

    const entityId = entity.id;
    if (geoPointEntityIds.has(entityId)) {
      window.dispatchEvent(
        new CustomEvent<GeoPointSelectedEventDetail>(GEO_POINT_SELECTED_EVENT, {
          detail: { id: entityId, name: (entity.name as string | undefined) ?? "Geo Point" },
        })
      );
    } else {
      window.dispatchEvent(new CustomEvent(GEO_POINT_DESELECTED_EVENT));
    }
  });
}

function destroyLabelSyncSubscriptions(): void {
  _positionSub?.unsubscribe();
  _actionSub?.unsubscribe();
  _positionSub = null;
  _actionSub = null;
  _currentEditingShape = null;
  _pendingEntityIconPath = null;
  if (_pendingApplyTimer !== null) {
    clearTimeout(_pendingApplyTimer);
    _pendingApplyTimer = null;
  }
}

const defaultLocation: OmnisysStartLocation = {
  lat: 31.0461,
  lon: 34.8516,
  height: 1500000,
};

const ROUTE_ARROW_ICON_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxNicgdmlld0JveD0nMCAwIDE2IDE2Jz4KICA8cG9seWdvbiBwb2ludHM9JzgsMCAxNiwxNiA4LDEyIDAsMTYnIGZpbGw9J3doaXRlJy8+Cjwvc3ZnPg==";

export function initOmnisysCesium(
  container: HTMLElement,
  options: OmnisysCesiumInitOptions = {}
): MapRuntimeInstance {
  window.CESIUM_BASE_URL = "/cesium/";

  const configuredMapSources =
    options.mapSources ??
    (generatedMapSourcesConfig.mapSources as MapSourcesConfig | undefined);

  const useBaseLayerPicker =
    options.baseLayerPicker !== undefined
      ? options.baseLayerPicker && Boolean(configuredMapSources)
      : Boolean(configuredMapSources);

  const instance = new OmnisysCesium(container, {
    globeType: 2,
    timeline: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    customToolbar: false,
    navigate: true,
    location: options.location ?? defaultLocation,
    toolBarItems: [],
    pointIcons: [],
    isInfoBox: false,
    isPositionActive: true,
    isMovement: true,
    isTooltip: true,
    depthTestAgainstTerrain: true,
    showTimeline: false,
    baseLayerPicker: useBaseLayerPicker,
    mapSources: configuredMapSources,
  } as never);

  if (options.ionToken) {
    instance.defaultToken = options.ionToken;
  }

  // PATCH: strip the hardcoded private-IP modelUri that is baked into
  // createRadarComplexShape's defaults:
  //   modelUri: "http://192.168.2.112/assets/gltf/s300-lp/scene.gltf"
  //
  // buildComplexOptions merges library-supplied `additional` LAST, so user-side
  // options cannot override it. Patching buildComplexOptions at the instance level
  // is the only way to prevent Cesium from firing a network request to an
  // unreachable private IP on every friendly-entity click, which otherwise stalls
  // the map until the TCP connection times out (60-90 s).
  {
    const instanceAny = instance as unknown as {
      buildComplexOptions: (
        opts: Record<string, unknown>,
        additional: Record<string, unknown>
      ) => Record<string, unknown>;
    };
    const _originalBuildComplexOptions = instanceAny.buildComplexOptions.bind(instance);
    instanceAny.buildComplexOptions = function patchedBuildComplexOptions(
      opts: Record<string, unknown>,
      additional: Record<string, unknown>
    ) {
      const result = _originalBuildComplexOptions(opts, additional);
      // Remove any modelUri that points to an external / unreachable server
      if (result.additional && typeof result.additional === "object") {
        delete (result.additional as Record<string, unknown>).modelUri;
      }
      return result;
    };
  }

  const runtimeWithEventBus = instance as unknown as OmnisysWithEventBus;
  const eventBus = runtimeWithEventBus.getEventBus?.();
  if (eventBus) {
    const mapEventFallbackListener = eventBus.on("map-event", () => {
      return;
    });
    if (typeof mapEventFallbackListener === "function") {
      mapEventFallbackListeners.set(
        instance as unknown as object,
        mapEventFallbackListener
      );
    }
  }

  activeRuntimeInstance = instance;

  initLabelSyncSubscriptions();
  initEntityClickTracking();

  return instance;
}

/**
 * After placing Sector entities the library registers CallbackPositionProperty /
 * CallbackProperty instances with `isConstant = false` (meaning "value changes
 * every frame"). This defeats Cesium's `requestRenderMode: true` and forces the
 * engine to render the full scene at ~60 fps indefinitely, even while the map is
 * completely idle. The result is sluggish panning because the GPU is fully occupied.
 *
 * Fix: once a Sector is placed (positions are fixed), sample the current values and
 * replace each dynamic callback with a static ConstantProperty / ConstantPositionProperty.
 * Cesium will then return to on-demand rendering and panning will be smooth again.
 */
function freezePlacedSectorDynamicProperties(sectorShapeIds: string[]): void {
  const viewerManagerRaw = ViewerManager as unknown as { viewer?: Cesium.Viewer };
  const viewer = viewerManagerRaw.viewer;
  if (!viewer) return;

  const currentTime = viewer.clock.currentTime;

  for (const sectorId of sectorShapeIds) {
    // Freeze main sector entity position
    const sectorEntity = viewer.entities.getById(sectorId);
    if (sectorEntity?.position) {
      try {
        const pos = sectorEntity.position.getValue(currentTime, new Cesium.Cartesian3());
        if (pos) {
          sectorEntity.position = new Cesium.ConstantPositionProperty(
            pos,
            Cesium.ReferenceFrame.FIXED
          );
        }
      } catch { /* ignore */ }
    }

    // Freeze arrow entity — named "sector-azimuth-${sectorId}" in the library
    const arrowName = `sector-azimuth-${sectorId}`;
    for (const entity of viewer.entities.values) {
      if (entity.name !== arrowName) continue;

      // Freeze arrow position
      if (entity.position) {
        try {
          const pos = entity.position.getValue(currentTime, new Cesium.Cartesian3());
          if (pos) {
            entity.position = new Cesium.ConstantPositionProperty(
              pos,
              Cesium.ReferenceFrame.FIXED
            );
          }
        } catch { /* ignore */ }
      }

      // Freeze arrow billboard rotation
      if (entity.billboard?.rotation) {
        try {
          const rot = (entity.billboard.rotation as Cesium.Property).getValue(currentTime);
          entity.billboard.rotation = new Cesium.ConstantProperty(rot ?? 0);
        } catch { /* ignore */ }
      }

      // Freeze arrow billboard show (currently a scene-mode check callback)
      if (entity.billboard?.show) {
        try {
          const show = (entity.billboard.show as Cesium.Property).getValue(currentTime);
          entity.billboard.show = new Cesium.ConstantProperty(show ?? true);
        } catch { /* ignore */ }
      }

      break;
    }
  }
}

export async function triggerRadarComplexShapeFromFriendlyMenu(
  options?: FriendlyRadarShapeOptions
): Promise<boolean> {
  if (!activeRuntimeInstance) {
    return false;
  }

  const omnisysRuntime = activeRuntimeInstance as unknown as OmnisysWithRadarComplexShape;
  if (typeof omnisysRuntime.createRadarComplexShape !== "function") {
    return false;
  }

  // Store the sidebar-selected icon path so the position$ subscriber can
  // apply it immediately when the entity is placed on the map (before Save).
  _pendingEntityIconPath = options?.iconPath ?? null;

  // Pass the entity color so that the inner Marker's applyStyle() uses it instead of
  // defaulting to #ff0000 (RED) when the user types a name in the ShapeEditorUI.
  await omnisysRuntime.createRadarComplexShape({
    additional: { color: options?.color ?? "#ffffff" },
  });

  // The entity has been saved; clear the pending icon so future position$ events
  // for other entities are not affected.
  _pendingEntityIconPath = null;
  if (_pendingApplyTimer !== null) {
    clearTimeout(_pendingApplyTimer);
    _pendingApplyTimer = null;
  }

  const runtimeWithInternals = activeRuntimeInstance as unknown as {
    radarComplexShape?: {
      id?: string;
      name?: string;
      mapEntities?: Array<{ id?: string; name?: string }>;
    };
  };

  const radarShape = runtimeWithInternals.radarComplexShape;
  if (!radarShape) {
    return true;
  }

  // The user may have typed a name during the ShapeEditorUI session. That name is
  // stored on the inner Marker (mapEntities[0]). Propagate it to the ComplexFeature.
  const innerMarker = radarShape.mapEntities?.[0];
  const userTypedName =
    innerMarker?.name && innerMarker.name !== "Marker" && innerMarker.name !== "BaseShape"
      ? innerMarker.name
      : null;

  if (userTypedName) {
    radarShape.name = userTypedName;
  }

  const radarMainId = radarShape.id;
  const markerDisplayName = userTypedName ?? "Friendly Radar";

  if (radarMainId) {
    const radarEntity = ViewerManager.getById(radarMainId);
    if (radarEntity) {
      // Update billboard with the friendly icon.
      if (radarEntity.billboard) {
        if (options?.iconPath) {
          radarEntity.billboard.image = new Cesium.ConstantProperty(options.iconPath);
        }
        radarEntity.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
      }

      // The library creates the inner Marker with showLabel:false so no Cesium label
      // element exists at all. Add one explicitly so the name appears below the icon.
      radarEntity.label = new Cesium.LabelGraphics({
        text: new Cesium.ConstantProperty(markerDisplayName),
        font: "14px sans-serif",
        fillColor: Cesium.Color.WHITE,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        backgroundPadding: new Cesium.Cartesian2(7, 4),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, 60),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      });

      radarEntity.name = markerDisplayName;
    }
  }

  // Freeze the two Sector sub-shapes (defenseDome + radar) that the library adds
  // as mapEntities[1] and mapEntities[2]. mapEntities[0] is the main Marker.
  const sectorIds = (radarShape.mapEntities ?? [])
    .slice(1)
    .map((part) => part?.id)
    .filter((id): id is string => typeof id === "string");

  if (sectorIds.length > 0) {
    freezePlacedSectorDynamicProperties(sectorIds);
  }

  return true;
}

export async function triggerRouteComplexShapeFromEnemyMenu(
  options: EnemyRouteShapeOptions
): Promise<boolean> {
  if (!activeRuntimeInstance) {
    return false;
  }

  const omnisysRuntime = activeRuntimeInstance as unknown as OmnisysWithRouteComplexShape;
  if (typeof omnisysRuntime.createRouteComplexShape !== "function") {
    return false;
  }

  await omnisysRuntime.createRouteComplexShape({
    additional: {
      drawerType: DrawerShapesEnum.ROUTE,
    },
  });

  const runtimeWithInternals = activeRuntimeInstance as unknown as {
    routeComplexShape?: {
      id?: string;
      name?: string;
      positions?: Array<{ lat: number; lon: number; alt?: number }>;
      mapEntities?: Array<{ id?: string; name?: string }>;
    };
    drawerManager?: {
      addPartToComplexFeature?: (complexId: string, partShape: unknown) => void;
    };
  };

  const complexShape = runtimeWithInternals.routeComplexShape;
  if (!complexShape?.id || !complexShape.positions || !runtimeWithInternals.drawerManager?.addPartToComplexFeature) {
    return true;
  }

  // The user may have typed a name in ShapeEditorUI during drawing.
  // That name is set on the Polyline (mapEntities[0]), NOT on the ComplexFeature itself
  // (ComplexFeature is created after drawing completes and always defaults to 'BaseShape').
  // Copy the name from the Polyline to the ComplexFeature so it is reflected everywhere.
  const drawingPolyline = complexShape.mapEntities?.[0];
  const userTypedName =
    drawingPolyline?.name && drawingPolyline.name !== "BaseShape"
      ? drawingPolyline.name
      : null;

  if (userTypedName) {
    complexShape.name = userTypedName;
    // Also update the Cesium entity name for the Polyline
    const polylineEntity = ViewerManager.getById(drawingPolyline?.id ?? "");
    if (polylineEntity) {
      polylineEntity.name = userTypedName;
    }
  }

  const routeArrowPrimitive = ViewerManager.getPrimitiveById("primitiveRouteArrows", complexShape.id) as
    | { length?: number; get?: (index: number) => { image?: unknown } | undefined }
    | undefined;
  if (routeArrowPrimitive?.get && typeof routeArrowPrimitive.length === "number") {
    for (let index = 0; index < routeArrowPrimitive.length; index += 1) {
      const billboard = routeArrowPrimitive.get(index);
      if (billboard) {
        billboard.image = ROUTE_ARROW_ICON_DATA_URL;
      }
    }
  }

  if (Array.isArray(complexShape.mapEntities) && complexShape.mapEntities.length > 1) {
    const mainPart = complexShape.mapEntities[0];
    const extraParts = complexShape.mapEntities.slice(1);

    for (const part of extraParts) {
      if (part?.id) {
        ViewerManager.removeEntity(part.id);
      }
    }

    complexShape.mapEntities = mainPart ? [mainPart] : [];
  }

  const markerName = userTypedName ?? "Complex Route";

  const marker = new Marker({
    positions: complexShape.positions.map((position) => ({
      lat: position.lat,
      lon: position.lon,
      alt: position.alt ?? 0,
    })),
    zIndex: 0,
    show: true,
    additional: {
      color: options.color ?? "rgba(239, 83, 80, 1)",
      iconPath: options.iconPath,
      showLabel: true,
      labelText: markerName,
    },
    name: markerName,
    oType: MapEntityTypeEnum.COMPLEX,
  });

  runtimeWithInternals.drawerManager.addPartToComplexFeature(complexShape.id, marker);

  if (options.iconPath && marker.id) {
    const markerEntity = ViewerManager.getById(marker.id);
    if (markerEntity?.billboard) {
      markerEntity.billboard.image = new Cesium.ConstantProperty(options.iconPath);
      markerEntity.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
    }
  }

  return true;
}

export async function triggerPointFromGeoMenu(
  options: GeoPointShapeOptions
): Promise<boolean> {
  if (!activeRuntimeInstance) {
    return false;
  }

  const runtimeWithDrawer = activeRuntimeInstance as unknown as {
    drawerManager?: {
      drawShape: (
        type: unknown,
        positions: unknown[],
        options?: Record<string, unknown>
      ) => Promise<{
        id?: string;
        name?: string;
        mapEntities?: Array<{ id?: string; name?: string }>;
      } | null>;
    };
  };

  if (!runtimeWithDrawer.drawerManager?.drawShape) {
    return false;
  }

  _pendingEntityIconPath = options.iconPath ?? null;

  const placedShape = await runtimeWithDrawer.drawerManager
    .drawShape(MapEntityTypeEnum.MARKER, [], {
      additional: { color: options.color ?? GEO_PURPLE },
    })
    .catch(() => null);

  _pendingEntityIconPath = null;
  if (_pendingApplyTimer !== null) {
    clearTimeout(_pendingApplyTimer);
    _pendingApplyTimer = null;
  }

  // null means the user cancelled the placement
  if (!placedShape?.id) {
    return true;
  }

  const userTypedName =
    placedShape.name && placedShape.name !== "Marker" && placedShape.name !== "BaseShape"
      ? placedShape.name
      : null;

  // Register this entity ID so click events can identify it as a GeoPoint.
  geoPointEntityIds.add(placedShape.id);

  const markerDisplayName = userTypedName ?? "Geo Point";
  const markerEntity = ViewerManager.getById(placedShape.id);
  if (markerEntity) {
    if (markerEntity.billboard) {
      if (options.iconPath) {
        markerEntity.billboard.image = new Cesium.ConstantProperty(options.iconPath);
      }
      markerEntity.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
      markerEntity.billboard.scale = new Cesium.ConstantProperty(0.7);
      markerEntity.billboard.verticalOrigin = new Cesium.ConstantProperty(Cesium.VerticalOrigin.CENTER);
      markerEntity.billboard.horizontalOrigin = new Cesium.ConstantProperty(Cesium.HorizontalOrigin.CENTER);
      markerEntity.billboard.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(0, 0));
    }

    markerEntity.label = new Cesium.LabelGraphics({
      text: new Cesium.ConstantProperty(markerDisplayName),
      font: "14px sans-serif",
      fillColor: Cesium.Color.WHITE,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      backgroundPadding: new Cesium.Cartesian2(7, 4),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, 40),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });

    markerEntity.name = markerDisplayName;
  }

  return true;
}

const GEO_PURPLE = "#8C9EFF";
const OPERATIONAL_GEO_YELLOW = "#F9A825";
const OPERATIONAL_GEO_POLYGON_GREEN = "#0F824A";

export async function triggerRouteFromOperationalGeoMenu(
  options: OperationalGeoShapeOptions
): Promise<boolean> {
  if (!activeRuntimeInstance) {
    return false;
  }

  const omnisysRuntime = activeRuntimeInstance as unknown as OmnisysWithRouteComplexShape;
  if (typeof omnisysRuntime.createRouteComplexShape !== "function") {
    return false;
  }

  // Defcon border line: white lines only — no marker, no arrows.
  // Pass iconPath so the library's internal marker uses a valid data URL
  // instead of a broken default URL (which would cause a 404).
  // Defcon border line is always white — ignore options.color (which comes from
  // the menu definition and is yellow by default).
  await omnisysRuntime.createRouteComplexShape({
    additional: {
      drawerType: DrawerShapesEnum.ROUTE,
      color: "#ffffff",
      iconPath: options.iconPath,
    },
  });

  const runtimeWithInternals = activeRuntimeInstance as unknown as {
    routeComplexShape?: {
      id?: string;
      name?: string;
      positions?: Array<{ lat: number; lon: number; alt?: number }>;
      mapEntities?: Array<{ id?: string; name?: string }>;
    };
  };

  const complexShape = runtimeWithInternals.routeComplexShape;
  if (!complexShape?.id) {
    return true;
  }

  // Immediately hide every billboard on every entity the library created.
  // The library creates internal Marker entities with a broken default icon URL,
  // which cause 404s. Setting show=false stops Cesium retrying the image load.
  for (const part of complexShape.mapEntities ?? []) {
    if (part?.id) {
      const entity = ViewerManager.getById(part.id);
      if (entity?.billboard) {
        entity.billboard.show = new Cesium.ConstantProperty(false);
      }
    }
  }

  // Copy the user-typed name from the Polyline (mapEntities[0]) to the ComplexFeature.
  const drawingPolyline = complexShape.mapEntities?.[0];
  const userTypedName =
    drawingPolyline?.name && drawingPolyline.name !== "BaseShape"
      ? drawingPolyline.name
      : null;

  if (userTypedName) {
    complexShape.name = userTypedName;
    const polylineEntity = ViewerManager.getById(drawingPolyline?.id ?? "");
    if (polylineEntity) {
      polylineEntity.name = userTypedName;
    }
  }

  // Force the polyline to white — belt-and-suspenders in case the library
  // ignores the `color` in `additional` for the line material.
  if (drawingPolyline?.id) {
    const polylineEntity = ViewerManager.getById(drawingPolyline.id);
    if (polylineEntity?.polyline) {
      polylineEntity.polyline.material = new Cesium.ColorMaterialProperty(
        Cesium.Color.WHITE
      );
      // Also cover styled-polyline where color lives on the material directly.
      const mat = polylineEntity.polyline.material as unknown as { color?: { setValue: (c: Cesium.Color) => void } };
      mat?.color?.setValue(Cesium.Color.WHITE);
    }
  }

  // Hide all direction arrows — this is a lines-only entity.
  const routeArrowPrimitive = ViewerManager.getPrimitiveById("primitiveRouteArrows", complexShape.id) as
    | { length?: number; get?: (index: number) => { show?: boolean } | undefined }
    | undefined;
  if (routeArrowPrimitive?.get && typeof routeArrowPrimitive.length === "number") {
    for (let index = 0; index < routeArrowPrimitive.length; index += 1) {
      const billboard = routeArrowPrimitive.get(index);
      if (billboard) {
        billboard.show = false;
      }
    }
  }

  // Remove any extra ghost entities added by the library (keep only the polyline).
  if (Array.isArray(complexShape.mapEntities) && complexShape.mapEntities.length > 1) {
    const mainPart = complexShape.mapEntities[0];
    const extraParts = complexShape.mapEntities.slice(1);
    for (const part of extraParts) {
      if (part?.id) {
        ViewerManager.removeEntity(part.id);
      }
    }
    complexShape.mapEntities = mainPart ? [mainPart] : [];
  }

  return true;
}

export async function triggerPolygonFromOperationalGeoMenu(
  options: OperationalGeoShapeOptions
): Promise<boolean> {
  if (!activeRuntimeInstance) {
    return false;
  }

  const runtimeWithDrawer = activeRuntimeInstance as unknown as {
    drawerManager?: {
      drawShape: (
        type: unknown,
        positions: unknown[],
        options?: Record<string, unknown>
      ) => Promise<{
        id?: string;
        name?: string;
        mapEntities?: Array<{ id?: string; name?: string }>;
      } | null>;
    };
  };

  if (!runtimeWithDrawer.drawerManager?.drawShape) {
    return false;
  }

  _pendingEntityIconPath = options.iconPath ?? null;

  const placedShape = await runtimeWithDrawer.drawerManager
    .drawShape(MapEntityTypeEnum.POLYGON, [], {
      additional: { color: options.color ?? OPERATIONAL_GEO_POLYGON_GREEN },
    })
    .catch(() => null);

  _pendingEntityIconPath = null;
  if (_pendingApplyTimer !== null) {
    clearTimeout(_pendingApplyTimer);
    _pendingApplyTimer = null;
  }

  if (!placedShape?.id) {
    return true;
  }

  // Propagate user-typed name from the shape entity
  const userTypedName =
    placedShape.name && placedShape.name !== "Polygon" && placedShape.name !== "BaseShape"
      ? placedShape.name
      : null;

  const polygonEntity = ViewerManager.getById(placedShape.id);
  if (polygonEntity) {
    if (userTypedName) {
      polygonEntity.name = userTypedName;
    }

    // Apply display name label
    const displayName = userTypedName ?? "Operational Polygon";
    polygonEntity.label = new Cesium.LabelGraphics({
      text: new Cesium.ConstantProperty(displayName),
      font: "14px sans-serif",
      fillColor: Cesium.Color.WHITE,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      backgroundPadding: new Cesium.Cartesian2(7, 4),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });

    polygonEntity.name = displayName;
  }

  return true;
}

export function destroyOmnisysCesium(instance?: MapRuntimeInstance | null): void {
  if (!instance) {
    return;
  }

  const internalViewer = (
    instance as unknown as { _viewer?: { destroy?: () => void; isDestroyed?: () => boolean } }
  )._viewer;

  const runtimeWithEventBus = instance as unknown as OmnisysWithEventBus;
  const eventBus = runtimeWithEventBus.getEventBus?.();
  const fallbackListener = mapEventFallbackListeners.get(instance as unknown as object);
  if (eventBus && fallbackListener) {
    eventBus.removeListener("map-event", fallbackListener);
    mapEventFallbackListeners.delete(instance as unknown as object);
  }

  if (internalViewer?.destroy && !internalViewer.isDestroyed?.()) {
    internalViewer.destroy();
  }

  const viewerManagerState = ViewerManager as unknown as {
    viewer?: unknown;
    mapHandlers?: Map<string, unknown>;
    primitiveCollections?: Map<string, unknown>;
  };

  viewerManagerState.viewer = undefined;
  viewerManagerState.mapHandlers?.clear();
  viewerManagerState.primitiveCollections?.clear();

  if (activeRuntimeInstance === instance) {
    activeRuntimeInstance = null;
    destroyLabelSyncSubscriptions();
    _entityClickInitialized = false;
    geoPointEntityIds.clear();
  }
}