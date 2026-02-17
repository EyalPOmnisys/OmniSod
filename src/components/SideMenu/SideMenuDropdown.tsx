import React, { useState } from "react";
import { ASSETS } from "../../constants/assets";
import { triggerRadarComplexShapeFromFriendlyMenu } from "../Map/initOmnisysCesium";
import { FriendlyOptionsMenu } from "./friendlyOptions/FriendlyOptionsMenu";
import "./SideMenuDropdown.css";

type YeshutType = "Friendly" | "Enemy" | "Geo" | "OperationalGeo";

interface DropdownItemProps {
  type: YeshutType;
  isActive?: boolean;
  onClick?: () => void;
}

function DropdownItem({ type, isActive, onClick }: DropdownItemProps) {
  const getIconElement = () => {
    switch (type) {
      case "Friendly":
        return (
          <img
            alt=""
            src={ASSETS.imgYeshutFriendly}
            className="friendly-icon"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "12px",
            }}
          />
        );
      case "Enemy":
        return (
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="enemy-icon side-menu-dropdown-icon-svg"
            aria-hidden="true"
          >
            <path d="M0 8.48535L8.48528 7.03335e-05L16.9706 8.48535L8.48528 16.9706L0 8.48535Z" fill="#EF5350" />
          </svg>
        );
      case "Geo":
        return (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="geo-icon side-menu-dropdown-icon-svg"
            aria-hidden="true"
          >
            <path d="M9 0C11.2091 0 13 1.79086 13 4V5H14C16.2091 5 18 6.79086 18 9C18 11.2091 16.2091 13 14 13H13V14C13 16.2091 11.2091 18 9 18C6.79086 18 5 16.2091 5 14V13H4C1.79086 13 0 11.2091 0 9C0 6.79086 1.79086 5 4 5H5V4C5 1.79086 6.79086 0 9 0Z" fill="#8C9EFF" />
          </svg>
        );
      case "OperationalGeo":
        return (
          <svg
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="operational-geo-icon side-menu-dropdown-icon-svg"
            aria-hidden="true"
          >
            <path d="M0 7.79415L4.5 -7.72476e-05H13.5L18 7.79415L13.5 15.5884H4.5L0 7.79415Z" fill="#F9A825" />
          </svg>
        );
    }
  };

  return (
    <button
      type="button"
      className={`side-menu-dropdown-button ${isActive ? "side-menu-dropdown-button-active" : ""}`}
      data-name="Dropdown button"
      onClick={onClick}
    >
      <span className="side-menu-dropdown-indicator">
        <img alt="" src={ASSETS.imgSidebarDropdownIndicator} />
      </span>
      {getIconElement()}
    </button>
  );
}

export function SideMenuDropdown({ id, className }: { id?: string; className?: string }) {
  const [activeOption, setActiveOption] = useState<YeshutType | null>(null);

  const handleOptionClick = (type: YeshutType) => {
    setActiveOption(activeOption === type ? null : type);
  };

  return (
    <div id={id} className={`side-menu-dropdown ${className || ""}`} data-name="Dropdown menu" data-node-id="340:9014">
      <div className="side-menu-dropdown-items">
        <DropdownItem
          type="Friendly"
          isActive={activeOption === "Friendly"}
          onClick={() => handleOptionClick("Friendly")}
        />
        <DropdownItem type="Enemy" />
        <DropdownItem type="Geo" />
        <DropdownItem type="OperationalGeo" />
      </div>
      {activeOption === "Friendly" && (
        <FriendlyOptionsMenu
          className="friendly-options-menu-dropdown"
          onOptionClick={async (friendlyType) => {
            const didTrigger = await triggerRadarComplexShapeFromFriendlyMenu();
            if (!didTrigger) {
              console.warn("Friendly option click could not trigger radar complex shape:", friendlyType);
            }
          }}
        />
      )}
    </div>
  );
}
