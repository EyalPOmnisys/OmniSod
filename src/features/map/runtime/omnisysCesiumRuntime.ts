"use client";

import * as Cesium from "cesium";
import { OmnisysCesium, type MapSourcesConfig } from "omnisys_cesium_lib";
import { ViewerManager } from "omnisys_cesium_lib/dist/services/viewerManager";
import { Marker } from "omnisys_cesium_lib/dist/shapes/marker/types/marker";
import { MapEntityTypeEnum } from "omnisys_cesium_lib/dist/enums/mapEntitiesEnum";
import { DrawerShapesEnum } from "omnisys_cesium_lib/dist/enums/drawerShapesEnum";
import type {
  EnemyRouteShapeOptions,
  FriendlyRadarShapeOptions,
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

type OmnisysWithEventBus = {
  getEventBus?: () => {
    on: (name: string, listener: (event: unknown) => void) => (event: unknown) => void;
    removeListener: (name: string, listener: (event: unknown) => void) => void;
  };
};

let activeRuntimeInstance: MapRuntimeInstance | null = null;
const mapEventFallbackListeners = new WeakMap<object, (event: unknown) => void>();

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

  return instance;
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

  await omnisysRuntime.createRadarComplexShape({});

  const runtimeWithInternals = activeRuntimeInstance as unknown as {
    radarComplexShape?: {
      id?: string;
    };
  };

  const radarMainId = runtimeWithInternals.radarComplexShape?.id;
  if (radarMainId && options?.iconPath) {
    const radarEntity = ViewerManager.getById(radarMainId);
    if (radarEntity?.billboard) {
      radarEntity.billboard.image = new Cesium.ConstantProperty(options.iconPath);
      radarEntity.billboard.color = new Cesium.ConstantProperty(Cesium.Color.WHITE);
    }
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
      positions?: Array<{ lat: number; lon: number; alt?: number }>;
      mapEntities?: Array<{ id?: string }>;
    };
    drawerManager?: {
      addPartToComplexFeature?: (complexId: string, partShape: unknown) => void;
    };
  };

  const complexShape = runtimeWithInternals.routeComplexShape;
  if (!complexShape?.id || !complexShape.positions || !runtimeWithInternals.drawerManager?.addPartToComplexFeature) {
    return true;
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
    },
    name: "Complex Route",
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
  }
}