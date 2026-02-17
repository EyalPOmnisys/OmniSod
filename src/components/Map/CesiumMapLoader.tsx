"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR - Cesium requires browser APIs (window, document, WebGL)
const CesiumMapInner = dynamic(
  () => import("./CesiumMap").then((mod) => mod.CesiumMap),
  { ssr: false }
);

export function CesiumMapLoader({ className }: { className?: string }) {
  return <CesiumMapInner className={className} />;
}
