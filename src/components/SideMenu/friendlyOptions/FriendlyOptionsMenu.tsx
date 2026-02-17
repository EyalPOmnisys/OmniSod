import React from "react";
import { ASSETS } from "../../../constants/assets";
import "./FriendlyOptionsMenu.css";

type FriendlyOptionType = "Soldier" | "Tank" | "Radar" | "Armor";

interface FriendlyOptionProps {
  type: FriendlyOptionType;
  onClick: () => void;
}

function FriendlyOption({ type, onClick }: FriendlyOptionProps) {
  const getIconConfig = () => {
    switch (type) {
      case "Soldier":
        return {
          src: ASSETS.imgFriendlySoldier,
          alt: "Soldier",
        };
      case "Tank":
        return {
          src: ASSETS.imgFriendlyTank,
          alt: "Tank",
        };
      case "Radar":
        return {
          src: ASSETS.imgFriendlyRadar,
          alt: "Radar",
        };
      case "Armor":
        return {
          src: ASSETS.imgFriendlyArmor,
          alt: "Armor",
        };
    }
  };

  const config = getIconConfig();

  return (
    <button
      type="button"
      className="friendly-option-button"
      onClick={onClick}
      data-name={`Friendly ${config.alt}`}
    >
      <img alt={config.alt} src={config.src} className="friendly-option-icon" />
    </button>
  );
}

export function FriendlyOptionsMenu({
  id,
  className,
  onOptionClick,
}: {
  id?: string;
  className?: string;
  onOptionClick?: (type: FriendlyOptionType) => void;
}) {
  const handleOptionClick = (type: FriendlyOptionType) => {
    if (onOptionClick) {
      onOptionClick(type);
    }
  };

  return (
    <div
      id={id}
      className={`friendly-options-menu ${className || ""}`}
      data-name="Friendly Options Menu"
    >
      <FriendlyOption type="Soldier" onClick={() => handleOptionClick("Soldier")} />
      <FriendlyOption type="Tank" onClick={() => handleOptionClick("Tank")} />
      <FriendlyOption type="Radar" onClick={() => handleOptionClick("Radar")} />
      <FriendlyOption type="Armor" onClick={() => handleOptionClick("Armor")} />
    </div>
  );
}