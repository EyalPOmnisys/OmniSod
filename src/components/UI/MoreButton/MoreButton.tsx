import React from "react";
import "./MoreButton.css";

function DotsIcon() {
  return (
    <svg width="17" height="4" viewBox="0 0 17 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.44 1.75C13.44 0.783502 14.1922 0 15.12 0C16.0478 0 16.8 0.783502 16.8 1.75C16.8 2.7165 16.0478 3.5 15.12 3.5C14.1922 3.5 13.44 2.7165 13.44 1.75ZM6.72 1.75C6.72 0.783502 7.47216 0 8.4 0C9.32784 0 10.08 0.783502 10.08 1.75C10.08 2.7165 9.32784 3.5 8.4 3.5C7.47216 3.5 6.72 2.7165 6.72 1.75ZM0 1.75C0 0.783502 0.752162 0 1.68 0C2.60784 0 3.36 0.783502 3.36 1.75C3.36 2.7165 2.60784 3.5 1.68 3.5C0.752162 3.5 0 2.7165 0 1.75Z" fill="white"/>
    </svg>
  );
}

export function MoreButton({ className }: { className?: string }) {
  return (
    <div className={`more-button-container ${className || ""}`} data-name="More button" data-node-id="366:13106">
      <div className="more-button-inner" data-name="State=Default" data-node-id="366:13108">
        <div className="more-button-icon" data-name="Icon" data-node-id="366:13128">
          <div className="more-button-icon-inner" data-name="More" data-node-id="I366:13128;77:911">
            <div className="more-button-vector" data-name="Vector" data-node-id="I366:13128;77:911;78:932">
              <DotsIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
