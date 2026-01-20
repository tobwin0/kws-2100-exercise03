import React, { useEffect, useRef, useState } from "react";
import { OSM } from "ol/source.js";
import TileLayer from "ol/layer/Tile.js";
import { View, Map, Feature, MapBrowserEvent } from "ol";
import { useGeographic } from "ol/proj.js";

// CSS
import "ol/ol.css";
import "./application.css";

useGeographic();

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({ center: [11, 59], zoom: 8 }),
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  return (
    <>
      <h1>Regioner i Norge</h1>
      <main>
        {/* OSM Map (tile map / puslespill kart) */}
        <div ref={mapRef}></div>
      </main>
    </>
  );
}
