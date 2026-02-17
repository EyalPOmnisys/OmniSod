import React from "react";
import { ASSETS } from "../../../constants/assets";
import "./MoreButton.css";

export function MoreButton({ className }: { className?: string }) {
  return (
    <div className={`more-button-container ${className || ""}`} data-name="More button" data-node-id="366:13106">
      <div className="more-button-inner" data-name="State=Default" data-node-id="366:13108">
        <div className="more-button-icon" data-name="Icon" data-node-id="366:13128">
          <div className="more-button-icon-inner" data-name="More" data-node-id="I366:13128;77:911">
            <div className="more-button-vector" data-name="Vector" data-node-id="I366:13128;77:911;78:932">
              <img alt="" src={ASSETS.imgVector1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
