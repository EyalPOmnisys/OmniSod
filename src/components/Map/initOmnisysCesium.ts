"use client";

import * as Cesium from "cesium";
import { OmnisysCesium, type MapSourcesConfig } from "omnisys_cesium_lib";
import { ViewerManager } from "omnisys_cesium_lib/dist/services/viewerManager";
import generatedMapSourcesConfig from "@/config/mapSources.generated.json";

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

export type OmnisysStartLocation = {
  lat: number;
  lon: number;
  height: number;
};

export type OmnisysCesiumInitOptions = {
  ionToken?: string;
  baseLayerPicker?: boolean;
  mapSources?: MapSourcesConfig;
  location?: OmnisysStartLocation;
  allowFallback?: boolean;
};

export type OmnisysCesiumInstance = InstanceType<typeof OmnisysCesium>;

export type CesiumFallbackInstance = {
  __fallbackViewer: true;
  viewer: Cesium.Viewer;
};

export type MapRuntimeInstance = OmnisysCesiumInstance | CesiumFallbackInstance;

type OmnisysWithRadarComplexShape = {
  createRadarComplexShape?: (options?: Record<string, unknown>) => Promise<unknown>;
};

type OmnisysWithEventBus = {
  getEventBus?: () => {
    on: (name: string, listener: (event: unknown) => void) => (event: unknown) => void;
    removeListener: (name: string, listener: (event: unknown) => void) => void;
  };
};

let activeRuntimeInstance: MapRuntimeInstance | null = null;
let mapEventFallbackListener: ((event: unknown) => void) | null = null;

const defaultLocation: OmnisysStartLocation = {
  lat: 31.0461,
  lon: 34.8516,
  height: 1500000,
};

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

  try {
    const instance = new OmnisysCesium(container, {
      globeType: 2,
      timeline: false,
      requestRenderMode: false,
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
      mapEventFallbackListener = eventBus.on("map-event", () => {
        return;
      });
    }

    activeRuntimeInstance = instance;

    return instance;
  } catch (error) {
    if (!options.allowFallback) {
      throw error;
    }

    console.warn("OmnisysCesium failed to initialize. Falling back to native Cesium Viewer.", error);

    if (options.ionToken) {
      Cesium.Ion.defaultAccessToken = options.ionToken;
    }

    const viewer = new Cesium.Viewer(container, {
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
      selectionIndicator: false,
      requestRenderMode: true,
      maximumRenderTimeChange: 1.0,
    });

    viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(34.2, 29.5, 35.9, 33.4),
    });

    const fallbackInstance: CesiumFallbackInstance = {
      __fallbackViewer: true,
      viewer,
    };

    activeRuntimeInstance = fallbackInstance;

    return fallbackInstance;
  }
}

export async function triggerRadarComplexShapeFromFriendlyMenu(): Promise<boolean> {
  if (!activeRuntimeInstance || "__fallbackViewer" in activeRuntimeInstance) {
    return false;
  }

  const omnisysRuntime = activeRuntimeInstance as unknown as OmnisysWithRadarComplexShape;
  if (typeof omnisysRuntime.createRadarComplexShape !== "function") {
    return false;
  }

  await omnisysRuntime.createRadarComplexShape({});
  return true;
}

export function destroyOmnisysCesium(instance?: MapRuntimeInstance | null): void {
  if (!instance) {
    return;
  }

  if ("__fallbackViewer" in instance) {
    if (!instance.viewer.isDestroyed()) {
      instance.viewer.destroy();
    }
    if (activeRuntimeInstance === instance) {
      activeRuntimeInstance = null;
    }
    return;
  }

  const internalViewer = (
    instance as unknown as { _viewer?: { destroy?: () => void; isDestroyed?: () => boolean } }
  )._viewer;

  const runtimeWithEventBus = instance as unknown as OmnisysWithEventBus;
  const eventBus = runtimeWithEventBus.getEventBus?.();
  if (eventBus && mapEventFallbackListener) {
    eventBus.removeListener("map-event", mapEventFallbackListener);
    mapEventFallbackListener = null;
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
