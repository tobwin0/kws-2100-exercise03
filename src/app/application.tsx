import React, { useEffect, useMemo, useRef, useState } from "react";
import { StadiaMaps } from "ol/source.js";
import TileLayer from "ol/layer/Tile.js";
import { Feature, Map, View } from "ol";
import { useGeographic } from "ol/proj.js";
import { KommuneSideBar } from "../components/KommuneSideBar.js";

// CSS
import "ol/ol.css";
import "./application.css";
import { Layer } from "ol/layer.js";
import { FylkesLayerCheckbox } from "../components/fylkesLayerCheckbox.js";
import { KommuneLayerCheckbox } from "../components/kommuneLayerCheckbox.js";
import { BackgroundLayerSelect } from "../layers/backgroundLayerSelect.js";

useGeographic();

const view = new View({ center: [11, 59], zoom: 8 });
const map = new Map({ view });

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [fylkesLayers, setFylkesLayers] = useState<Layer[]>([]);
  const [kommuneLayers, setKommuneLayers] = useState<Layer[]>([]);
  const [backgroundLayer, setBackgroundLayer] = useState<Layer>(
    new TileLayer({ source: new StadiaMaps({ layer: "alidade_smooth" }) }),
  );
  const layers = useMemo(
    () => [backgroundLayer, ...fylkesLayers, ...kommuneLayers],
    [fylkesLayers, kommuneLayers, backgroundLayer],
  );
  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  // Click effect for kommuner (når man klikker på en kommune skal navnet vises i h1 teksten)
  const [selectedKommune, setSelectedKommune] = useState<Feature>();
  // setter ref for map div
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  // Alle kommuner
  const [allKommuner, setAllKommuner] = useState<Feature[]>([]);

  return (
    <>
      <header>
        <h1>
          {selectedKommune
            ? selectedKommune.getProperties()["kommunenavn"]
            : "Regioner i Norge"}
        </h1>
        <BackgroundLayerSelect setBackgroundLayer={setBackgroundLayer} />
        <FylkesLayerCheckbox setFylkesLayers={setFylkesLayers} map={map} />
        <KommuneLayerCheckbox
          setKommuneLayers={setKommuneLayers}
          map={map}
          setAllKommuner={setAllKommuner}
          setSelectedKommune={setSelectedKommune}
        />
      </header>
      <main>
        {/* OSM Map (tile map / puslespill kart) */}
        <div ref={mapRef} id="map"></div>
        {/* Sidebar */}
        {allKommuner && kommuneLayers.length > 0 && (
          <KommuneSideBar
            allKommuner={allKommuner}
            view={view}
            setSelectedKommune={setSelectedKommune}
          />
        )}
      </main>
    </>
  );
}
