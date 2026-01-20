import React, { useEffect, useRef, useState } from "react";
import { OSM } from "ol/source.js";
import TileLayer from "ol/layer/Tile.js";
import { View, Map, Feature, MapBrowserEvent } from "ol";
import { useGeographic } from "ol/proj.js";

// CSS
import "ol/ol.css";
import "./application.css";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import { GeoJSON } from "ol/format.js";

useGeographic();

// geojson source and layer
// for fylker i Norge
const fylkeSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/fylker.geojson",
  format: new GeoJSON(),
});
const fylkeLayer = new VectorLayer({ source: fylkeSource });
// for kommuner i Norge
const kommuneSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/kommuner.geojson",
  format: new GeoJSON(),
});
const kommuneLayer = new VectorLayer({ source: kommuneSource });

const layers = [new TileLayer({ source: new OSM() }), fylkeLayer, kommuneLayer];
const view = new View({ center: [11, 59], zoom: 8 });
const map = new Map({ layers, view });

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
