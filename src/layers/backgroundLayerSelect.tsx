import { Layer } from "ol/layer.js";
import { OSM, StadiaMaps } from "ol/source.js";
import { useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile.js";

const OSMlayer = new TileLayer({ source: new OSM() });
const stadiaMapsLayer = new TileLayer({
  source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
});

export function BackgroundLayerSelect({
  setBackgroundLayer,
}: {
  setBackgroundLayer: (value: Layer) => void;
}) {
  const [backgroundLayerValue, setBackgroundLayerValue] =
    useState<string>("osm");

  useEffect(() => {
    setBackgroundLayer(OSMlayer);
  }, []);
  // Setter bakgrunnslag basert på valg i select
  useEffect(() => {
    if (backgroundLayerValue === "osm") {
      setBackgroundLayer(OSMlayer);
    }
    if (backgroundLayerValue === "stadia") {
      setBackgroundLayer(stadiaMapsLayer);
    }
  }, [backgroundLayerValue]);
  return (
    <select
      value={backgroundLayerValue}
      onChange={(e) => setBackgroundLayerValue(e.target.value)}
    >
      <option value={"osm"}>OpenStreetMap bakgrunn</option>
      <option value={"stadia"}>Stadia bakgrunnskart</option>
    </select>
  );
}
