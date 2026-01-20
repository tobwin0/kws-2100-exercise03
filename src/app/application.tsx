import React, { useEffect, useRef, useState } from "react";
import { OSM } from "ol/source.js";
import TileLayer from "ol/layer/Tile.js";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { useGeographic } from "ol/proj.js";
import {
  fylkeLayer,
  fylkeSource,
  kommuneLayer,
  kommuneSource,
} from "./layers.js";

// CSS
import "ol/ol.css";
import "./application.css";
import Style from "ol/style/Style.js";
import type { FeatureLike } from "ol/Feature.js";
import { Text } from "ol/style.js";
import { getCenter } from "ol/extent.js";

useGeographic();

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

  // Alle kommuner
  const [allKommuner, setAllKommuner] = useState<Feature[]>();
  // useEffect som setter alle kommuner
  useEffect(() => {
    kommuneSource.on("change", () => {
      setAllKommuner(kommuneSource.getFeatures());
    });
  }, []);

  // setter ref for map div
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  function handleClickKommune(kommune: Feature) {
    setSelectedKommune(kommune);
    const geometry = kommune.getGeometry();
    view.animate({
      center: getCenter(geometry!.getExtent()),
      zoom: 10,
    });
  }

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
        {/* Sidebar */}
        <aside>
          <h2>Kommuner</h2>
          <ul>
            {allKommuner
              ?.sort((a, b) =>
                a
                  .getProperties()
                  [
                    "kommunenavn"
                  ].localeCompare(b.getProperties()["kommunenavn"]),
              )
              .map((kommune) => (
                <li
                  key={kommune.getProperties()["kommunenummer"]}
                  onClick={() => handleClickKommune(kommune)}
                >
                  {kommune.getProperties()["kommunenavn"]}
                </li>
              ))}
          </ul>
        </aside>
      </main>
    </>
  );
}
