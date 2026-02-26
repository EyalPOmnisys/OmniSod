export type EntityMenuKind = "Friendly" | "Enemy" | "Geo" | "OperationalGeo";

export type FriendlyOptionType = "Soldier" | "Tank" | "Radar" | "Armor";
export type EnemyOptionType = "EnemyA" | "EnemyB" | "EnemyC" | "EnemyD" | "EnemyE";
export type GeoOptionType = "GeoPoint";
export type OperationalGeoOptionType = "Route" | "Polygon";

export type SideMenuPrimaryOption = EntityMenuKind;

export type BaseEntityOptionSelection<TType extends string> = {
  type: TType;
  name: string;
  iconPath: string;
  color: string;
};

export type FriendlyOptionSelection = BaseEntityOptionSelection<FriendlyOptionType>;

export type EnemyOptionSelection = BaseEntityOptionSelection<EnemyOptionType>;

export type GeoOptionSelection = BaseEntityOptionSelection<GeoOptionType>;

export type OperationalGeoOptionSelection = BaseEntityOptionSelection<OperationalGeoOptionType>;

export type EntityOptionSelectionByKind<K extends EntityMenuKind> =
  K extends "Friendly" ? FriendlyOptionSelection :
  K extends "Enemy" ? EnemyOptionSelection :
  K extends "Geo" ? GeoOptionSelection :
  OperationalGeoOptionSelection;

export type EntityOptionClickHandler<K extends EntityMenuKind> = (
  selection: EntityOptionSelectionByKind<K>
) => void;
