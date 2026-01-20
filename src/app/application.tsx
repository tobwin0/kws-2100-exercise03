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
import GeoJSON from "ol/format/GeoJSON.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import type { FeatureLike } from "ol/Feature.js";
import { Text } from "ol/style.js";

useGeographic();

// geojson source and layer
// for fylker i Norge
const fylkeSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/fylker.geojson",
  format: new GeoJSON(),
});
const fylkeLayer = new VectorLayer({
  source: fylkeSource,
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 2,
    }),
    fill: new Fill({ color: "rgba(85, 50, 30, 0.2)" }),
  }), // end style
});

// for kommuner i Norge
const kommuneSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/kommuner.geojson",
  format: new GeoJSON(),
});
const kommuneLayer = new VectorLayer({
  source: kommuneSource,
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
  }), // end style
});

const layers = [new TileLayer({ source: new OSM() }), kommuneLayer, fylkeLayer];
const view = new View({ center: [11, 59], zoom: 8 });
const map = new Map({ layers, view });

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  // hover effect over fylke
  const [activeFylke, setActiveFylke] = useState<Feature>();

  // style for activeFylke
  function activeFylkeStyle(fylke: FeatureLike) {
    const fylkeName = fylke.getProperties()["fylkesnavn"];
    return new Style({
      text: new Text({
        text: fylkeName,
        scale: 2,
      }),
    });
  }
  function handlePointerMove(e: MapBrowserEvent) {
    const fylke = fylkeSource.getFeaturesAtCoordinate(e.coordinate);
    setActiveFylke(fylke.length > 0 ? fylke[0] : undefined);
  }
  // useEffect som legger til hover effect på fylker
  useEffect(() => {
    activeFylke?.setStyle(activeFylkeStyle);
    return () => {
      activeFylke?.setStyle(undefined);
    };
  }, [activeFylke]);

  // Click effect for kommuner (når man klikker på en kommune skal navnet vises i h1 teksten)
  const [selectedKommune, setSelectedKommune] = useState<Feature>();
  function handleMapClick(e: MapBrowserEvent) {
    const kommune = kommuneSource.getFeaturesAtCoordinate(e.coordinate);
    console.log(kommune);
    setSelectedKommune(kommune.length > 0 ? kommune[0] : undefined);
  }
  // useEffect som legger til click(for klikk på kommune) og pointer(for hover fylke) event handler på kartet
  useEffect(() => {
    map.on("pointermove", handlePointerMove);
    map.on("click", handleMapClick);

    // cleanup function for å fjerne event listeners når komponenten unmountes slik at man unngår memory leaks
    return () => {
      map.un("pointermove", handlePointerMove);
      map.un("click", handleMapClick);
    };
  }, []);

  // setter ref for map div
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  return (
    <>
      <h1>
        {selectedKommune
          ? selectedKommune.getProperties()["kommunenavn"]
          : "Regioner i Norge"}
      </h1>
      <main>
        {/* OSM Map (tile map / puslespill kart) */}
        <div ref={mapRef} id="map"></div>
      </main>
    </>
  );
}
