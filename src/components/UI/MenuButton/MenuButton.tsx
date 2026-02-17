import React from "react";
import "./MenuButton.css";

type MenuButtonProps = {
  className?: string;
  state?: "Default" | "With backgrounnd";
  text?: string;
  type?: "Text" | "Icon";
};

export function MenuButton({ className, state = "Default", text = "Label", type = "Text" }: MenuButtonProps) {
  return (
    <div className={`menu-button-container ${className || ""}`} data-node-id="366:13010">
      <p className="menu-button-text" dir="auto" data-node-id="366:13016">
        {text}
      </p>
    </div>
  );
}
