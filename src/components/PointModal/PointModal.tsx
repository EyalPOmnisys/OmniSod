import React from "react";
import { ASSETS } from "../../constants/assets";
import "./PointModal.css";

type ButtonProps = {
  className?: string;
  icon?: boolean;
  size?: "Large";
  state?: "Default" | "Hover";
  text?: string;
  type?: "Primary" | "Secondary";
};

function Button({ 
  className, 
  icon = true, 
  size = "Large", 
  state = "Default", 
  text = "Button", 
  type = "Primary" 
}: ButtonProps) {
  const isPrimaryAndLargeAndDefault = type === "Primary" && size === "Large" && state === "Default";
  const isSecondaryAndLargeAndDefault = type === "Secondary" && size === "Large" && state === "Default";
  
  const buttonClass = `button ${type === "Primary" ? "button-primary" : "button-secondary"} ${className || ""}`;
  const textClass = `button-text ${type === "Primary" ? "button-text-primary" : "button-text-secondary"}`;
  
  return (
    <div className={buttonClass} id={isSecondaryAndLargeAndDefault ? "node-366_9669" : "node-366_9665"}>
      {icon && (
        <div className="button-icon" data-name="Icon" data-node-id="366:9677">
          <div className="button-icon-inner" data-name="Plus" data-node-id="I366:9677;293:2221">
            <div className="button-icon-vector" data-name="Vector" data-node-id="I366:9677;293:2221;261:2486">
              <img alt="" src={ASSETS.imgPlusIcon} />
            </div>
          </div>
        </div>
      )}
      {isPrimaryAndLargeAndDefault && (
        <p className={textClass} data-node-id="366:9678">
          {text}
        </p>
      )}
      {isSecondaryAndLargeAndDefault && (
        <p className={textClass} data-node-id="366:9686">
          {text}
        </p>
      )}
    </div>
  );
}

type DropdownIconProps = {
  className?: string;
  position?: "Down" | "Up" | "Right";
  size?: "Small";
  type?: "Arrow" | "Triangle";
};

function DropdownIcon({ 
  className, 
  position = "Down", 
  size = "Small", 
  type = "Arrow" 
}: DropdownIconProps) {
  const isArrowAndDownAndSmall = type === "Arrow" && position === "Down" && size === "Small";
  const isTriangleAndDownAndSmall = type === "Triangle" && position === "Down" && size === "Small";
  const isTriangleAndRightAndSmall = type === "Triangle" && position === "Right" && size === "Small";
  
  const containerClass = isTriangleAndDownAndSmall || isTriangleAndRightAndSmall 
    ? "dropdown-icon-triangle" 
    : "dropdown-icon-arrow";
  
  const id = isTriangleAndRightAndSmall ? "node-15_349" : isTriangleAndDownAndSmall ? "node-15_337" : "node-15_329";
  
  return (
    <div className={`${containerClass} ${className || ""}`} id={id}>
      {isArrowAndDownAndSmall && (
        <div className="dropdown-icon-arrow-vector" data-name="Vector 2 (Stroke)" data-node-id="15:330">
          <img alt="" src={ASSETS.imgVector2Stroke} />
        </div>
      )}
      {isTriangleAndDownAndSmall && (
        <div className="dropdown-icon-triangle-vector" data-name="Vector" data-node-id="15:338">
          <img alt="" src={ASSETS.imgTriangleVector} />
        </div>
      )}
      {isTriangleAndRightAndSmall && (
        <div className="dropdown-icon-triangle-right">
          <div className="dropdown-icon-triangle-right-inner">
            <div className="dropdown-icon-triangle-right-inner-content" data-name="Vector" data-node-id="15:350">
              <img alt="" src={ASSETS.imgVector1Rotated} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PointModal() {
  return (
    <div className="point-modal" data-name="Modal" data-node-id="421:17706">
      {/* Header */}
      <div className="modal-header" data-node-id="I421:17706;89:1546">
        <div className="modal-title" data-node-id="I421:17706;89:1547">
          <p dir="auto">Point</p>
        </div>
      </div>

      {/* Content */}
      <div className="modal-content" data-name="Small Modal Content" data-node-id="I421:17706;89:1683">
        {/* Name Field */}
        <div className="modal-content-inner" data-name="Modal Content" data-node-id="I421:17706;89:1683;127:2455">
          <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2469">
            <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2469;44:3801">
              Name
            </p>
            <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2469;44:3802">
              <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2469;44:3802;127:2120">
                <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2469;44:3802;127:2121">
                  Label
                </p>
              </div>
              <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2469;44:3802;127:1592">
                <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2469;44:3802;127:1593">
                  <p dir="auto">sec</p>
                </div>
              </div>
            </div>
            <p className="form-field-help" data-node-id="I421:17706;89:1683;127:2469;229:1763">
              Help text
            </p>
          </div>
        </div>

        {/* Position Dropdown */}
        <div className="modal-dropdown" data-name="Modal Dropdown" data-node-id="I421:17706;89:1683;127:2377">
          <button className="dropdown-button" data-node-id="I421:17706;89:1683;127:2377;89:1503">
            <DropdownIcon className="dropdown-icon" type="Triangle" />
            <div className="dropdown-label" data-node-id="I421:17706;89:1683;127:2377;89:1505">
              <p>Position</p>
            </div>
            <div data-node-id="I421:17706;89:1683;127:2377;561:4148" />
          </button>
          <div className="dropdown-content-position" data-name="Type=Position- edit" data-node-id="I421:17706;89:1683;127:2377;89:1506">
            <div className="button button-primary" data-name="Button" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3158">
              <p className="button-text button-text-primary" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3158;37:575">
                Edit
              </p>
            </div>
            <div className="grid-counter-row" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3174">
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3801">
                  Grid Size
                </p>
                <div className="value-field" data-name="Value Field" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802">
                  <div className="value-icon" data-name="Icon" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1633">
                    <div className="value-icon-inner" data-name="Minus" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1633;293:2212">
                      <div className="value-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1633;293:2212;51:1651">
                        <img alt="" src={ASSETS.imgMinusIcon} />
                      </div>
                    </div>
                  </div>
                  <p className="value-text" dir="auto" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1634">
                    &nbsp;
                  </p>
                  <div className="unit-container" data-name="Unit Container" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1716">
                    <p className="unit-text" dir="auto" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1714">
                      sec
                    </p>
                    <div className="value-icon" data-name="Icon" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1637">
                      <div className="value-icon-inner" data-name="Plus" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1637;293:2212">
                        <div className="value-icon-vector-plus" data-name="Vector" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3175;44:3802;51:1637;293:2212;49:819">
                          <img alt="" src={ASSETS.imgPlusIconSmall} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-counter">
                <div className="grid-counter-inner" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3176">
                  <div className="grid-counter-text" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3177">
                    <p>Grid Counter:</p>
                  </div>
                  <div className="grid-counter-value" data-node-id="I421:17706;89:1683;127:2377;89:1506;745:3178">
                    <p>0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title Dropdown */}
        <div className="modal-dropdown" data-name="Modal Dropdown" data-node-id="I421:17706;89:1683;127:2492">
          <button className="dropdown-button" data-node-id="I421:17706;89:1683;127:2492;89:1503">
            <div className="dropdown-icon" data-name="Dropdown icon" data-node-id="I421:17706;89:1683;127:2492;89:1504">
              <div className="dropdown-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:2492;89:1504;127:2368">
                <img alt="" src={ASSETS.imgTriangleVector} />
              </div>
            </div>
            <div className="dropdown-label" data-node-id="I421:17706;89:1683;127:2492;89:1505">
              <p>Section Title</p>
            </div>
            <div data-node-id="I421:17706;89:1683;127:2492;561:4148" />
          </button>
          <div className="dropdown-content" data-name="Type=Multiple Fields" data-node-id="I421:17706;89:1683;127:2492;89:1506">
            <div className="position-fields" data-name="Position" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2605">
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2606;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2607;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-fields" data-name="Position" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2649">
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2650;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2651;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-fields" data-name="Position" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2675">
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2676;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2677;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="position-fields" data-name="Position" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2701">
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2702;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703">
                <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3801">
                  Title
                </p>
                <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3802">
                  <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3802;127:2120">
                    <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3802;127:2121">
                      Label
                    </p>
                  </div>
                  <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3802;127:1592">
                    <div className="suffix-text" data-node-id="I421:17706;89:1683;127:2492;89:1506;127:2703;44:3802;127:1593">
                      <p dir="auto">sec</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section Dropdown */}
        <div className="modal-dropdown" data-name="Modal Dropdown" data-node-id="I421:17706;89:1683;127:3193">
          <button className="dropdown-button" data-node-id="I421:17706;89:1683;127:3193;89:1503">
            <div className="dropdown-icon" data-name="Dropdown icon" data-node-id="I421:17706;89:1683;127:3193;89:1504">
              <div className="dropdown-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:3193;89:1504;127:2368">
                <img alt="" src={ASSETS.imgTriangleVector} />
              </div>
            </div>
            <div className="dropdown-label" data-node-id="I421:17706;89:1683;127:3193;89:1505">
              <p>Section Title</p>
            </div>
            <div data-node-id="I421:17706;89:1683;127:3193;561:4148" />
          </button>
          <div className="dropdown-content" style={{ paddingBottom: "12px", justifyContent: "center" }} data-name="Type=Equipment" data-node-id="I421:17706;89:1683;127:3193;89:1506">
            <div className="equipment-container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3090">
              <div className="equipment-row" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3071">
                <div className="equipment-type" data-name="Equipment Type" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057">
                  <div className="equipment-icon" data-name="Icon" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3030">
                    <div className="equipment-icon-inner" data-name="Detectors" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3030;36:544">
                      <div className="equipment-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3030;36:544;9:54">
                        <img alt="" src={ASSETS.imgDetectorIcon} />
                      </div>
                    </div>
                  </div>
                  <div className="equipment-label" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3033">
                    <p dir="auto">Label</p>
                  </div>
                  <div className="equipment-toggle" data-name="Toggle" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045">
                    <div className="toggle-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045;398:2411">
                      <div className="toggle-switch" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045;1012:2863">
                        <div className="toggle-switch-inner" data-name="mat-input--selection-controls" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045;1012:2864">
                          <div className="toggle-switch-img">
                            <img alt="" src={ASSETS.imgToggleSwitch} />
                          </div>
                        </div>
                      </div>
                      <div className="toggle-label-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045;398:2415">
                        <p className="toggle-label-text" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3057;127:3045;398:2416">
                          Toggle title
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="equipment-type-selected" data-name="Equipment Type" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064">
                  <div className="equipment-icon" data-name="Icon" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3050">
                    <div className="equipment-icon-inner" data-name="Detectors" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3050;36:544">
                      <div className="equipment-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3050;36:544;9:54">
                        <img alt="" src={ASSETS.imgDetectorIcon} />
                      </div>
                    </div>
                  </div>
                  <div className="equipment-label" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3051">
                    <p dir="auto">Label</p>
                  </div>
                  <div className="equipment-toggle-selected" data-name="Toggle" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052">
                    <div className="toggle-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052;398:2411">
                      <div className="toggle-switch" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052;1012:2863">
                        <div className="toggle-switch-inner" data-name="mat-input--selection-controls" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052;1012:2864">
                          <div className="toggle-switch-img">
                            <img alt="" src={ASSETS.imgToggleSwitch} />
                          </div>
                        </div>
                      </div>
                      <div className="toggle-label-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052;398:2415">
                        <p className="toggle-label-text" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3064;127:3052;398:2416">
                          Toggle title
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="equipment-type" data-name="Equipment Type" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072">
                  <div className="equipment-icon" data-name="Icon" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3030">
                    <div className="equipment-icon-inner" data-name="Detectors" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3030;36:544">
                      <div className="equipment-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3030;36:544;9:54">
                        <img alt="" src={ASSETS.imgDetectorIcon} />
                      </div>
                    </div>
                  </div>
                  <div className="equipment-label" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3033">
                    <p dir="auto">Label</p>
                  </div>
                  <div className="equipment-toggle" data-name="Toggle" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045">
                    <div className="toggle-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045;398:2411">
                      <div className="toggle-switch" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045;1012:2863">
                        <div className="toggle-switch-inner" data-name="mat-input--selection-controls" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045;1012:2864">
                          <div className="toggle-switch-img">
                            <img alt="" src={ASSETS.imgToggleSwitch} />
                          </div>
                        </div>
                      </div>
                      <div className="toggle-label-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045;398:2415">
                        <p className="toggle-label-text" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3072;127:3045;398:2416">
                          Toggle title
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pagination" data-name="Pagination" data-node-id="I421:17706;89:1683;127:3193;89:1506;127:3086">
                <img alt="" src={ASSETS.imgPagination} />
              </div>
            </div>
            <div className="form-field" style={{ width: "140px" }} data-name="Form Field" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258">
              <p className="form-field-label" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3801">
                Title
              </p>
              <div className="input-field" data-name="Input Field" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3802">
                <div className="input-container" data-name="Container" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3802;127:2120">
                  <p className="input-text" dir="auto" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3802;127:2121">
                    Label
                  </p>
                </div>
                <div className="input-suffix" data-name="Suffix" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3802;127:1592">
                  <div className="suffix-text" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;44:3802;127:1593">
                    <p dir="auto">sec</p>
                  </div>
                </div>
              </div>
              <p className="form-field-help" data-node-id="I421:17706;89:1683;127:3193;89:1506;745:3258;229:1763">
                Help text
              </p>
            </div>
          </div>
        </div>

        {/* Tags & Comment Section */}
        <div className="modal-dropdown" data-name="Modal Dropdown" data-node-id="I421:17706;89:1683;127:2539">
          <button className="dropdown-button" data-node-id="I421:17706;89:1683;127:2539;89:1503">
            <div className="dropdown-icon" data-name="Dropdown icon" data-node-id="I421:17706;89:1683;127:2539;89:1504">
              <div className="dropdown-icon-vector" data-name="Vector" data-node-id="I421:17706;89:1683;127:2539;89:1504;127:2368">
                <img alt="" src={ASSETS.imgTriangleVector} />
              </div>
            </div>
            <div className="dropdown-label" data-node-id="I421:17706;89:1683;127:2539;89:1505">
              <p>Section Title</p>
            </div>
            <div data-node-id="I421:17706;89:1683;127:2539;561:4148" />
          </button>
          <div className="dropdown-content" data-name="Type=Tags & Comment" data-node-id="I421:17706;89:1683;127:2539;89:1506">
            <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901">
              <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901;44:3801">
                Add Tags
              </p>
              <div className="tags-field" data-name="State=Empty, Property=Close" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901;44:3802">
                <p className="tags-placeholder" dir="auto" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901;44:3802;45:3884">
                  Label
                </p>
                <div className="tags-dropdown-icon" data-name="Dropdown icon" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901;44:3802;45:3885">
                  <div className="tags-dropdown-vector" data-name="Vector 2 (Stroke)" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2901;44:3802;45:3885;44:3743">
                    <img alt="" src={ASSETS.imgVector2Stroke} />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-field" data-name="Form Field" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958">
              <p className="form-field-label" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958;44:3801">
                Comment
              </p>
              <div className="textarea-wrapper" data-name="Text Area" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958;44:3802">
                <div className="textarea" data-name="Text Area" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958;44:3802;75:820">
                  <div className="textarea-inner" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958;44:3802;75:824">
                    <p>&nbsp;</p>
                  </div>
                </div>
                <p className="textarea-counter" data-node-id="I421:17706;89:1683;127:2539;89:1506;127:2958;44:3802;75:825">
                  0/250
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer" data-node-id="I421:17706;89:1558">
        <div className="footer-buttons" data-node-id="I421:17706;89:1559">
          <Button 
            className="button button-secondary" 
            icon={false} 
            text="Cancel" 
            type="Secondary" 
          />
          <Button 
            className="button button-primary" 
            icon={false} 
            text="Save" 
          />
        </div>
      </div>
    </div>
  );
}
