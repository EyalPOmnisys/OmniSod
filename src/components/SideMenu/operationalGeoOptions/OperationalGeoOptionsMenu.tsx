import React from "react";
import type {
  OperationalGeoOptionType,
  EntityOptionClickHandler,
} from "@/types/entities";
import {
  EntityOptionsMenu,
  type EntityOptionDefinition,
} from "../entityOptions/EntityOptionsMenu";
import { composeMapIconFromSvg } from "../entityOptions/iconComposer";

const OPERATIONAL_GEO_YELLOW = "#F9A825";
const OPERATIONAL_GEO_POLYGON_GREEN = "#0F824A";
const OPERATIONAL_GEO_ROUTE_WHITE = "#ffffff";

const getOperationalGeoIconElement = (type: OperationalGeoOptionType) => {
  switch (type) {
    case "Route":
      return (
        <svg width="24" height="24" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.2637 0.00996908L19.6932 0.838297C19.9035 0.889279 20.0367 1.12064 19.991 1.35453L19.246 5.16683C19.2003 5.40079 18.9922 5.54973 18.7818 5.49889C18.5714 5.44798 18.4374 5.2166 18.4831 4.98266L19.029 2.19374L12.596 6.79082C12.6303 6.93492 12.6506 7.08562 12.6506 7.24173C12.6506 8.21282 11.9427 9 11.0693 9C10.1961 8.99986 9.48798 8.21273 9.48798 7.24173C9.48799 7.13134 9.49821 7.0235 9.51572 6.91875L6.76512 3.86128C6.5407 3.99719 6.2839 4.0754 6.01036 4.0754C5.78476 4.07539 5.57054 4.02218 5.37636 3.92751L3.02966 6.53679C3.1148 6.75268 3.16264 6.99091 3.16266 7.24173C3.16266 8.21282 2.45469 9 1.58133 9C0.707982 8.99998 0 8.2128 0 7.24173C9.06421e-05 6.27074 0.708038 5.48348 1.58133 5.48346C1.90404 5.48346 2.20423 5.59107 2.45441 5.7756L4.69177 3.2879C4.52582 3.00973 4.42903 2.67594 4.42903 2.31713C4.42911 1.34614 5.13707 0.558893 6.01036 0.558861C6.88367 0.558861 7.59161 1.34612 7.59169 2.31713C7.59169 2.62311 7.52029 2.91028 7.39667 3.16088L9.94981 5.99969C10.236 5.68074 10.6321 5.48353 11.0693 5.48346C11.5204 5.48346 11.9268 5.69453 12.2149 6.03145L18.6071 1.4634L16.0981 0.857349C15.8877 0.806471 15.7546 0.575045 15.8002 0.341119C15.8461 0.107397 16.0534 -0.0408125 16.2637 0.00996908Z"
            fill="#F7F9FE"
          />
        </svg>
      );
    case "Polygon":
      return (
        <svg width="24" height="24" viewBox="-1 -2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 7.79415L4.5 0H13.5L18 7.79415L13.5 15.5884H4.5L0 7.79415Z"
            fill="#0F824A"
            stroke="#F7F9FE"
            strokeWidth="1.5"
          />
        </svg>
      );
  }
};

const operationalGeoOptions: OperationalGeoOptionType[] = ["Route", "Polygon"];

const OPERATIONAL_GEO_OPTION_DEFINITIONS: EntityOptionDefinition<"OperationalGeo">[] =
  operationalGeoOptions.map((type) => ({
    type,
    name: type,
    color: type === "Route" ? OPERATIONAL_GEO_ROUTE_WHITE : OPERATIONAL_GEO_POLYGON_GREEN,
    renderIcon: () => getOperationalGeoIconElement(type),
    createMapIconPath: (iconHost: HTMLSpanElement) => {
      const iconSvg = iconHost.querySelector("svg");
      if (!iconSvg) {
        return "";
      }
      return composeMapIconFromSvg(iconSvg, type === "Route" ? OPERATIONAL_GEO_ROUTE_WHITE : OPERATIONAL_GEO_POLYGON_GREEN);
    },
  }));

export function OperationalGeoOptionsMenu({
  id,
  className,
  onOptionClick,
}: {
  id?: string;
  className?: string;
  onOptionClick?: EntityOptionClickHandler<"OperationalGeo">;
}) {
  return (
    <EntityOptionsMenu<"OperationalGeo">
      id={id}
      className={className}
      options={OPERATIONAL_GEO_OPTION_DEFINITIONS}
      onOptionClick={onOptionClick}
    />
  );
}
