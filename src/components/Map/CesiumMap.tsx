"use client";

import React, { useEffect, useRef } from "react";
import "./Map.css";
import {
  destroyOmnisysCesium,
  initOmnisysCesium,
  type MapRuntimeInstance,
} from "@/features/map/runtime/omnisysCesiumRuntime";

let sharedRuntimeInstance: MapRuntimeInstance | null = null;
let sharedRuntimeContainer: HTMLDivElement | null = null;
let pendingDestroyTimer: ReturnType<typeof setTimeout> | null = null;
const DESTROY_DEBOUNCE_MS = 150;

export function CesiumMap({ className }: { className?: string }) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<MapRuntimeInstance | null>(null);

  useEffect(() => {
    if (pendingDestroyTimer) {
      clearTimeout(pendingDestroyTimer);
      pendingDestroyTimer = null;
    }

    if (!cesiumContainerRef.current) {
      return;
    }

    const container = cesiumContainerRef.current;

    if (sharedRuntimeInstance && sharedRuntimeContainer === container) {
      viewerRef.current = sharedRuntimeInstance;
    } else {
      if (sharedRuntimeInstance) {
        destroyOmnisysCesium(sharedRuntimeInstance);
      }

      sharedRuntimeInstance = initOmnisysCesium(container);
      sharedRuntimeContainer = container;
      viewerRef.current = sharedRuntimeInstance;
    }

    return () => {
      const mountedInstance = viewerRef.current;
      viewerRef.current = null;

      pendingDestroyTimer = setTimeout(() => {
        if (mountedInstance && mountedInstance === sharedRuntimeInstance) {
          destroyOmnisysCesium(sharedRuntimeInstance);
          sharedRuntimeInstance = null;
          sharedRuntimeContainer = null;
        }
        pendingDestroyTimer = null;
      }, DESTROY_DEBOUNCE_MS);
    };
  }, []);

  return (
    <div
      className={`map-container ${className || ""}`}
      data-name="Map"
      data-node-id="366:15894"
    >
      <div ref={cesiumContainerRef} className="cesium-map-wrapper" />
    </div>
  );
}
