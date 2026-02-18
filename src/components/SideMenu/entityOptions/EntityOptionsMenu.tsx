import React from "react";
import type {
  EntityMenuKind,
  EntityOptionClickHandler,
  EntityOptionSelectionByKind,
} from "@/types/entities";
import "./EntityOptionsMenu.css";

export type EntityOptionDefinition<K extends EntityMenuKind> = {
  type: EntityOptionSelectionByKind<K>["type"];
  name: string;
  renderIcon: (iconRef: React.RefObject<HTMLSpanElement | null>) => React.ReactNode;
  createMapIconPath: (iconHost: HTMLSpanElement) => string;
  color: string;
};

type EntityOptionButtonProps<K extends EntityMenuKind> = {
  option: EntityOptionDefinition<K>;
  onClick: (selection: EntityOptionSelectionByKind<K>) => void;
};

function EntityOptionButton<K extends EntityMenuKind>({
  option,
  onClick,
}: EntityOptionButtonProps<K>) {
  const iconRef = React.useRef<HTMLSpanElement | null>(null);

  const handleClick = () => {
    const iconHost = iconRef.current;
    if (!iconHost) {
      return;
    }

    onClick({
      type: option.type,
      name: option.name,
      iconPath: option.createMapIconPath(iconHost),
      color: option.color,
    } as EntityOptionSelectionByKind<K>);
  };

  return (
    <button
      type="button"
      className="entity-option-button"
      onClick={handleClick}
      data-name={`${option.name} Option`}
    >
      <span ref={iconRef} className="entity-option-icon">
        {option.renderIcon(iconRef)}
      </span>
    </button>
  );
}

export function EntityOptionsMenu<K extends EntityMenuKind>({
  id,
  className,
  options,
  onOptionClick,
}: {
  id?: string;
  className?: string;
  options: EntityOptionDefinition<K>[];
  onOptionClick?: EntityOptionClickHandler<K>;
}) {
  const handleOptionClick = (selection: EntityOptionSelectionByKind<K>) => {
    if (onOptionClick) {
      onOptionClick(selection);
    }
  };

  return (
    <div id={id} className={`entity-options-menu ${className || ""}`}>
      {options.map((option) => (
        <EntityOptionButton<K> key={option.type} option={option} onClick={handleOptionClick} />
      ))}
    </div>
  );
}