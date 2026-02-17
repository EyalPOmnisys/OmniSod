import React from "react";
import { ASSETS } from "../../constants/assets";
import "./Status.css";

type StatusProps = {
  className?: string;
  dropdown?: boolean;
};

export function Status({ className, dropdown = false }: StatusProps) {
  return (
    <div className={`status-container ${className || ""}`} data-name="status" data-node-id="366:15929">
      <div className="status-inner" data-name="Type=Draft, Size=Large" data-node-id="366:15938">
        <div className="status-icon-img" data-node-id="366:15976">
          <img alt="" src={ASSETS.imgFrame24226} />
        </div>
        <div className="status-text-container" data-node-id="366:15978">
          <p className="status-text" data-node-id="366:15979">
            Draft
          </p>
        </div>
        {dropdown && (
          <div className="status-dropdown-container" data-name="Dropdown icon" data-node-id="366:15980">
            <div className="status-dropdown-vector" data-name="Vector 2 (Stroke)" data-node-id="I366:15980;44:3743">
              <img alt="" src={ASSETS.imgDropdownIcon} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type StatusIconProps = {
  className?: string;
  state?: "View only" | "Edit";
};

export function StatusIcon({ className, state = "View only" }: StatusIconProps) {
  const isEdit = state === "Edit";
  const isViewOnly = state === "View only";
  return (
    <div className={`status-icon-container ${className || ""}`} id={isEdit ? "node-366_12909" : "node-366_12905"}>
      <div className="status-icon-inner" data-name="Icon" id={isEdit ? "node-366_12915" : "node-366_12911"}>
        {isViewOnly && (
          <div className="status-icon-show" data-name="Show" data-node-id="I366:12911;77:911">
            <div className="status-icon-vector-view" data-name="Vector" data-node-id="I366:12911;77:911;261:2492">
              <img alt="" src={ASSETS.imgVector2} />
            </div>
          </div>
        )}
        {isEdit && (
          <div className="status-icon-edit" data-name="Edit" data-node-id="I366:12915;77:911">
            <div className="status-icon-vector-edit" data-name="Vector" data-node-id="I366:12915;77:911;261:2426">
              <img alt="" src={ASSETS.imgVector3} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
