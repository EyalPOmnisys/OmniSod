"use client";

import React from "react";
import { TopBar } from "../components/TopBar/TopBar";
import { SideMenu } from "../components/SideMenu/SideMenu";
import { CesiumMapLoader } from "../components/Map/CesiumMapLoader";
import { PointModal } from "@/components/PointModal/PointModal";

export default function Home() {
  return (
    <div className="bg-white block relative w-screen h-screen overflow-hidden" data-name="Omnisod 50" data-node-id="392:10894">
      <CesiumMapLoader className="absolute inset-0 bg-white size-full" />
      <TopBar/>
      <SideMenu />
    </div>
  );
}
