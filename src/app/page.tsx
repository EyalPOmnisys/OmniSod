"use client";

import React, { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar/TopBar";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { CesiumMapLoader } from "../components/Map/CesiumMapLoader";
import { PointModal } from "@/components/PointModal/PointModal";
import {
  GEO_POINT_SELECTED_EVENT,
  GEO_POINT_DESELECTED_EVENT,
  type GeoPointSelectedEventDetail,
} from "@/features/map/runtime/omnisysCesiumRuntime";

export default function Home() {
  const [selectedGeoPoint, setSelectedGeoPoint] = useState<GeoPointSelectedEventDetail | null>(null);

  useEffect(() => {
    const onSelected = (e: Event) => {
      const detail = (e as CustomEvent<GeoPointSelectedEventDetail>).detail;
      setSelectedGeoPoint(detail);
    };
    const onDeselected = () => {
      setSelectedGeoPoint(null);
    };

    window.addEventListener(GEO_POINT_SELECTED_EVENT, onSelected);
    window.addEventListener(GEO_POINT_DESELECTED_EVENT, onDeselected);
    return () => {
      window.removeEventListener(GEO_POINT_SELECTED_EVENT, onSelected);
      window.removeEventListener(GEO_POINT_DESELECTED_EVENT, onDeselected);
    };
  }, []);

  return (
    <div className="bg-white block relative w-screen h-screen overflow-hidden" data-name="Omnisod 50" data-node-id="392:10894">
      <CesiumMapLoader className="absolute inset-0 bg-white size-full" />
      <TopBar/>
      <SideMenu />
      {selectedGeoPoint && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "16px",
            width: "320px",
            zIndex: 1000,
          }}
        >
          <PointModal
            visible
            entityName={selectedGeoPoint.name}
            onClose={() => setSelectedGeoPoint(null)}
          />
        </div>
      )}
    </div>
  );
}
