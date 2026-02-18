import type { MapSourcesConfig } from "omnisys_cesium_lib";

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
};

export type EnemyRouteShapeOptions = {
  iconPath: string;
  color?: string;
};

export type FriendlyRadarShapeOptions = {
  iconPath: string;
  color?: string;
};
