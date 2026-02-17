"use client";

import React, { useState } from "react";
import { ASSETS } from "../../constants/assets";
import { SideMenuDropdown } from "./SideMenuDropdown";
import "./SideMenu.css";

function LayersButton({ className }: { className?: string }) {
  return (
    <div className={className || ""} data-name="Layers button" data-node-id="32:838">
      <div className="layers-button-inner" data-name="Property 1=Default" data-node-id="33:2068">
        <div className="side-menu-button" data-name="Side menu button" data-node-id="291:2336">
          <div className="layers-icon-container" data-name="Icon" data-node-id="I291:2336;581:17617">
            <div className="layers-icon" data-name="Layers" data-node-id="I291:2336;581:17617;36:544">
              <div className="layers-vector" data-name="Vector" data-node-id="I291:2336;581:17617;36:544;2:17">
                <img alt="" src={ASSETS.imgSidebarVectorNew} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
      <g clipPath="url(#clip0_511_3007)">
        <path d="M28.6679 15.478H24.5191V14.1163C24.5191 13.2586 23.8306 12.5601 22.9851 12.5601H16.9973C16.1518 12.5601 15.4633 13.2586 15.4633 14.1163V15.478H11.3232C10.5475 15.478 9.91992 16.1146 9.91992 16.9015V25.4165C9.91992 26.2034 10.5475 26.8401 11.3232 26.8401H28.6767C29.4524 26.8401 30.0799 26.2034 30.0799 25.4165V16.8927C30.0799 16.1057 29.4524 15.4691 28.6767 15.4691L28.6679 15.478ZM16.0472 14.1163C16.0472 13.5857 16.4743 13.1525 16.9973 13.1525H22.9851C23.5081 13.1525 23.9352 13.5857 23.9352 14.1163V15.478H16.0472V14.1163ZM11.3232 16.654H28.6767C28.8074 16.654 28.912 16.7601 28.912 16.8927V20.854H20.5795V20.403C20.5795 20.0758 20.3181 19.8106 19.9956 19.8106C19.6731 19.8106 19.4116 20.0758 19.4116 20.403V20.854H11.0791V16.8927C11.0791 16.7601 11.1837 16.654 11.3145 16.654H11.3232ZM28.6767 25.6552H11.3232C11.1925 25.6552 11.0879 25.5491 11.0879 25.4165V21.4552H19.4203V21.9062C19.4203 22.2333 19.6818 22.4986 20.0043 22.4986C20.3268 22.4986 20.5882 22.2333 20.5882 21.9062V21.4552H28.9207V25.4165C28.9207 25.5491 28.8161 25.6552 28.6854 25.6552H28.6767Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_511_3007">
          <rect width="24" height="24" fill="white" transform="translate(8 8)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
      <g clipPath="url(#clip0_511_3011)">
        <path d="M29.7371 29.2398H10.2555C10.0733 29.2398 9.92139 29.0838 9.92139 28.8966C9.92139 28.7094 10.0733 28.5534 10.2555 28.5534H29.7371C29.9194 28.5534 30.0713 28.7094 30.0713 28.8966C30.0713 29.0838 29.9194 29.2398 29.7371 29.2398ZM15.2879 26.9623V11.4565C15.2879 11.0718 14.9842 10.7598 14.6095 10.7598C14.2349 10.7598 13.9311 11.0718 13.9311 11.4565V26.9623C13.9311 27.347 14.2349 27.659 14.6095 27.659C14.9842 27.659 15.2879 27.347 15.2879 26.9623ZM20.6747 26.9623V15.8867C20.6747 15.502 20.371 15.19 19.9963 15.19C19.6217 15.19 19.3179 15.502 19.3179 15.8867V26.9623C19.3179 27.347 19.6217 27.659 19.9963 27.659C20.371 27.659 20.6747 27.347 20.6747 26.9623ZM26.0615 26.9623V20.3482C26.0615 19.9634 25.7578 19.6514 25.3831 19.6514C25.0085 19.6514 24.7047 19.9634 24.7047 20.3482V26.9623C24.7047 27.347 25.0085 27.659 25.3831 27.659C25.7578 27.659 26.0615 27.347 26.0615 26.9623Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_511_3011">
          <rect width="24" height="24" fill="white" transform="translate(8 8)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function SideMenu({ className }: { className?: string }) {
  const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false);

  const toggleBriefcase = () => {
    setIsBriefcaseOpen((prev) => !prev);
  };

  return (
    <div
      className={`side-menu-container ${isBriefcaseOpen ? "side-menu-container-tools-open" : ""} ${className || ""}`}
      data-name="Side menu"
      data-node-id="12:828"
    >
      <div
        className={`side-menu-inner ${isBriefcaseOpen ? "side-menu-inner-tools-open" : ""}`}
        data-name="Property=Default"
        data-node-id="12:759"
      >
        <div
          className={`side-menu-top-container ${isBriefcaseOpen ? "side-menu-top-container-tools-open" : ""}`}
          data-name="Container"
          data-node-id="11:107"
        >
          <LayersButton className="layers-button-container" />
          <div className="side-menu-briefcase" data-name="Side menu button" data-node-id="11:101">
            <button
              type="button"
              className={`side-menu-button ${isBriefcaseOpen ? "side-menu-button-active" : ""}`}
              onClick={toggleBriefcase}
              aria-expanded={isBriefcaseOpen}
              aria-controls="side-menu-briefcase-dropdown"
            >
              <BriefcaseIcon />
            </button>
          </div>
          {isBriefcaseOpen && <SideMenuDropdown id="side-menu-briefcase-dropdown" />}
        </div>
        <div className="side-menu-button" data-name="Side menu button" data-node-id="11:104">
          <GraphIcon />
        </div>
      </div>
    </div>
  );
}
