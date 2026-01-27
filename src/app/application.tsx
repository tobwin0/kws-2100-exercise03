import React, { useEffect, useMemo, useRef, useState } from "react";
import { OSM } from "ol/source.js";
import TileLayer from "ol/layer/Tile.js";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { useGeographic } from "ol/proj.js";
import { kommuneLayer, kommuneSource } from "./layers.js";
import { KommuneSideBar } from "../components/KommuneSideBar.js";

// CSS
import "ol/ol.css";
import "./application.css";
import { Layer } from "ol/layer.js";
import { FylkesLayerCheckbox } from "../components/fylkesLayerCheckbox.js";

useGeographic();

const view = new View({ center: [11, 59], zoom: 8 });
const map = new Map({ view });

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [fylkesLayers, setFylkesLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [new TileLayer({ source: new OSM() }), ...fylkesLayers, kommuneLayer],
    [fylkesLayers],
  );
  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  // Click effect for kommuner (når man klikker på en kommune skal navnet vises i h1 teksten)
  const [selectedKommune, setSelectedKommune] = useState<Feature>();
  function handleMapClick(e: MapBrowserEvent) {
    const kommune = kommuneSource.getFeaturesAtCoordinate(e.coordinate);
    setSelectedKommune(kommune.length > 0 ? kommune[0] : undefined);
  }
  // useEffect som legger til click(for klikk på kommune) og pointer(for hover fylke) event handler på kartet
  useEffect(() => {
    map.on("click", handleMapClick);

    // cleanup function for å fjerne event listeners når komponenten unmountes slik at man unngår memory leaks
    return () => {
      map.un("click", handleMapClick);
    };
  }, []);

  // Alle kommuner
  const [allKommuner, setAllKommuner] = useState<Feature[]>([]);
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

  return (
    <>
      <header>
        <h1>
          {selectedKommune
            ? selectedKommune.getProperties()["kommunenavn"]
            : "Regioner i Norge"}
        </h1>
        <FylkesLayerCheckbox setFylkesLayers={setFylkesLayers} map={map} />
      </header>
      <main>
        {/* OSM Map (tile map / puslespill kart) */}
        <div ref={mapRef} id="map"></div>
        {/* Sidebar */}
        <KommuneSideBar
          allKommuner={allKommuner}
          view={view}
          setSelectedKommune={setSelectedKommune}
        />
        {/*        <aside>
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
        </aside>*/}
      </main>
    </>
  );
}
