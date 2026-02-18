import React from "react";
import "./Status.css";

function DraftCircleIcon() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="2.5" stroke="#F7F7F7"/>
    </svg>
  );
}

function ViewOnlyIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.7517 5.3732C16.7272 5.3179 16.1343 4.0026 14.8162 2.6845C13.0599 0.9282 10.8416 0 8.4 0C5.9584 0 3.7401 0.9282 1.98379 2.6845C0.665694 4.0026 0.0699933 5.32 0.0482933 5.3732C0.0164525 5.44482 0 5.52232 0 5.6007C0 5.67908 0.0164525 5.75658 0.0482933 5.8282C0.0727933 5.8835 0.665694 7.1981 1.98379 8.5162C3.7401 10.2718 5.9584 11.2 8.4 11.2C10.8416 11.2 13.0599 10.2718 14.8162 8.5162C16.1343 7.1981 16.7272 5.8835 16.7517 5.8282C16.7835 5.75658 16.8 5.67908 16.8 5.6007C16.8 5.52232 16.7835 5.44482 16.7517 5.3732ZM8.4 10.08C6.2454 10.08 4.3631 9.2967 2.8049 7.7525C2.16555 7.11669 1.62161 6.39167 1.18999 5.6C1.62149 4.80826 2.16544 4.08322 2.8049 3.4475C4.3631 1.9033 6.2454 1.12 8.4 1.12C10.5546 1.12 12.4369 1.9033 13.9951 3.4475C14.6357 4.08307 15.1808 4.8081 15.6135 5.6C15.1088 6.5422 12.9101 10.08 8.4 10.08ZM8.4 2.24C7.73545 2.24 7.08583 2.43706 6.53328 2.80626C5.98073 3.17546 5.55007 3.70022 5.29576 4.31418C5.04145 4.92814 4.97491 5.60373 5.10456 6.2555C5.23421 6.90728 5.55421 7.50598 6.02412 7.97588C6.49402 8.44578 7.09272 8.76579 7.7445 8.89544C8.39627 9.02509 9.07186 8.95855 9.68582 8.70424C10.2998 8.44993 10.8245 8.01927 11.1937 7.46672C11.5629 6.91417 11.76 6.26455 11.76 5.6C11.7591 4.70916 11.4048 3.85507 10.7749 3.22514C10.1449 2.59522 9.29084 2.24093 8.4 2.24ZM8.4 7.84C7.95697 7.84 7.52389 7.70863 7.15552 7.46249C6.78716 7.21636 6.50005 6.86652 6.33051 6.45721C6.16097 6.0479 6.11661 5.59752 6.20304 5.163C6.28947 4.72848 6.50281 4.32935 6.81608 4.01608C7.12935 3.70281 7.52848 3.48947 7.963 3.40304C8.39752 3.31661 8.8479 3.36097 9.25721 3.53051C9.66652 3.70005 10.0164 3.98716 10.2625 4.35552C10.5086 4.72389 10.64 5.15697 10.64 5.6C10.64 6.19409 10.404 6.76384 9.98392 7.18392C9.56384 7.604 8.99409 7.84 8.4 7.84Z" fill="white"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.4062 4.14756L12.6531 0.393745C12.1282 -0.131248 11.277 -0.131248 10.7521 0.393745L0.393971 10.7522C0.140773 11.0034 -0.00113165 11.3456 6.79753e-06 11.7022V15.456C6.79753e-06 16.1983 0.601765 16.8 1.34402 16.8H5.09803C5.45467 16.8011 5.79689 16.6592 6.04807 16.406L16.4062 6.04841C16.9313 5.52354 16.9313 4.67243 16.4062 4.14756ZM5.09803 15.456H1.34402V11.7022L8.73611 4.31051L12.4901 8.06433L5.09803 15.456ZM13.4402 7.11348L9.68616 3.36051L11.7022 1.34458L15.4562 5.09756L13.4402 7.11348Z" fill="white"/>
    </svg>
  );
}

type StatusProps = {
  className?: string;
  dropdown?: boolean;
};

export function Status({ className, dropdown = false }: StatusProps) {
  return (
    <div className={`status-container ${className || ""}`} data-name="status" data-node-id="366:15929">
      <div className="status-inner" data-name="Type=Draft, Size=Large" data-node-id="366:15938">
        <div className="status-icon-img" data-node-id="366:15976">
          <DraftCircleIcon />
        </div>
        <div className="status-text-container" data-node-id="366:15978">
          <p className="status-text" data-node-id="366:15979">
            Draft
          </p>
        </div>
        {dropdown && (
          <div className="status-dropdown-container" data-name="Dropdown icon" data-node-id="366:15980">
            <div className="status-dropdown-vector" data-name="Vector 2 (Stroke)" data-node-id="I366:15980;44:3743">
              <img alt="" src="" />
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
              <ViewOnlyIcon />
            </div>
          </div>
        )}
        {isEdit && (
          <div className="status-icon-edit" data-name="Edit" data-node-id="I366:12915;77:911">
            <div className="status-icon-vector-edit" data-name="Vector" data-node-id="I366:12915;77:911;261:2426">
              <EditIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
