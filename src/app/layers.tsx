// geojson source and layer
// for fylker i Norge
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";

export const fylkeSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/fylker.geojson",
  format: new GeoJSON(),
});
export const fylkeLayer = new VectorLayer({
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
export const kommuneSource = new VectorSource({
  url: "/kws-2100-exercise03/geojson/kommuner.geojson",
  format: new GeoJSON(),
});
export const kommuneLayer = new VectorLayer({
  source: kommuneSource,
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
  }), // end style
});
