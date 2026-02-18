export type EntityMenuKind = "Friendly" | "Enemy";

export type FriendlyOptionType = "Soldier" | "Tank" | "Radar" | "Armor";
export type EnemyOptionType = "EnemyA" | "EnemyB" | "EnemyC" | "EnemyD" | "EnemyE";

export type SideMenuPrimaryOption = EntityMenuKind | "Geo" | "OperationalGeo";

export type BaseEntityOptionSelection<TType extends string> = {
  type: TType;
  name: string;
  iconPath: string;
  color: string;
};

export type FriendlyOptionSelection = BaseEntityOptionSelection<FriendlyOptionType>;

export type EnemyOptionSelection = BaseEntityOptionSelection<EnemyOptionType>;

export type EntityOptionSelectionByKind<K extends EntityMenuKind> =
  K extends "Friendly" ? FriendlyOptionSelection : EnemyOptionSelection;

export type EntityOptionClickHandler<K extends EntityMenuKind> = (
  selection: EntityOptionSelectionByKind<K>
) => void;
