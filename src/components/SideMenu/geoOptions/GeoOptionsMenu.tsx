import React from "react";
import type {
  GeoOptionType,
  EntityOptionClickHandler,
} from "@/types/entities";
import {
  EntityOptionsMenu,
  type EntityOptionDefinition,
} from "../entityOptions/EntityOptionsMenu";

const GEO_PURPLE = "#8C9EFF";

/** Creates a large, background-less map icon directly from an SVG element. */
const composeGeoMapIcon = (iconSvg: SVGElement): string => {
  const iconClone = iconSvg.cloneNode(true) as SVGElement;
  const size = 20;
  iconClone.setAttribute("width", String(size));
  iconClone.setAttribute("height", String(size));
  const inner = iconClone.outerHTML
    .replace(/^<svg[^>]*>/i, "")
    .replace(/<\/svg>$/i, "");

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20">`,
    inner,
    `</svg>`,
  ].join("");

  const encoded = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
};

const getGeoIconElement = (type: GeoOptionType) => {
  switch (type) {
    case "GeoPoint":
      return (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.34938C5.22239 1.34938 1.34938 5.22239 1.34938 10C1.34938 14.7776 5.22239 18.6506 10 18.6506C14.7776 18.6506 18.6506 14.7776 18.6506 10C18.6506 5.22239 14.7776 1.34938 10 1.34938ZM10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7ZM10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8Z"
            fill="white"
          />
        </svg>
      );
  }
};

const geoOptions: GeoOptionType[] = ["GeoPoint"];

const GEO_OPTION_DEFINITIONS: EntityOptionDefinition<"Geo">[] = geoOptions.map(
  (type) => ({
    type,
    name: type,
    color: GEO_PURPLE,
    renderIcon: () => getGeoIconElement(type),
    createMapIconPath: (iconHost: HTMLSpanElement) => {
      const iconSvg = iconHost.querySelector("svg");
      if (!iconSvg) {
        return "";
      }
      return composeGeoMapIcon(iconSvg);
    },
  })
);

export function GeoOptionsMenu({
  id,
  className,
  onOptionClick,
}: {
  id?: string;
  className?: string;
  onOptionClick?: EntityOptionClickHandler<"Geo">;
}) {
  return (
    <EntityOptionsMenu<"Geo">
      id={id}
      className={className}
      options={GEO_OPTION_DEFINITIONS}
      onOptionClick={onOptionClick}
    />
  );
}
