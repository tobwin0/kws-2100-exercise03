import { Layer } from "ol/layer.js";
import { OSM, StadiaMaps, WMTS } from "ol/source.js";
import { useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile.js";
import { WMTSCapabilities } from "ol/format.js";
import { optionsFromCapabilities } from "ol/source/WMTS.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

proj4.defs(
  "EPSG:25833",
  "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
);
register(proj4);

const OSMlayer = new TileLayer({ source: new OSM() });

const stadiaMapsLayer = new TileLayer({
  source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
});

const kartverket = new TileLayer({});
const kartverketUrl =
  "https://cache.kartverket.no/v1/wmts/1.0.0/WMTSCapabilities.xml";
fetch(kartverketUrl).then(async (response) => {
  const parser = new WMTSCapabilities();
  kartverket.setSource(
    new WMTS(
      optionsFromCapabilities(parser.read(await response.text()), {
        layer: "toporaster",
        matrixSet: "webmercator",
      })!,
    ),
  );
});

const flyfoto = new TileLayer({});
const flyfotoUrl =
  "http://opencache.statkart.no/gatekeeper/gk/gk.open_nib_utm33_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities";
fetch(flyfotoUrl).then(async (response) => {
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(await response.text());
  flyfoto.setSource(
    new WMTS(
      optionsFromCapabilities(capabilities, {
        layer: "Nibcache_UTM33_EUREF89_v2",
        matrixSet: "default028mm",
      })!,
    ),
  );
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
    if (backgroundLayerValue === "kartverket") {
      setBackgroundLayer(kartverket);
    }
    if (backgroundLayerValue === "aerial") {
      setBackgroundLayer(flyfoto);
    }
  }, [backgroundLayerValue]);
  return (
    <select
      value={backgroundLayerValue}
      onChange={(e) => setBackgroundLayerValue(e.target.value)}
    >
      <option value={"osm"}>OpenStreetMap bakgrunn</option>
      <option value={"stadia"}>Stadia bakgrunnskart</option>
      <option value={"kartverket"}>Kartverkets bakgrunnskart</option>
      <option value={"aerial"}>Kartverkets flyfoto bakgrunnskart</option>
    </select>
  );
}
