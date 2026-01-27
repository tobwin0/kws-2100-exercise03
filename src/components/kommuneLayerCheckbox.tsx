import { Layer } from "ol/layer.js";
import { Feature, Map, MapBrowserEvent } from "ol";
import React, { useEffect, useState } from "react";
import { kommuneLayer, kommuneSource } from "../app/layers.js";

export function KommuneLayerCheckbox({
  setKommuneLayers,
  map,
  setAllKommuner,
  setSelectedKommune,
}: {
  setKommuneLayers: (layers: Layer[]) => void;
  map: Map;
  setAllKommuner: (features: Feature[]) => void;
  setSelectedKommune: (feature: Feature | undefined) => void;
}) {
  const [showKommuneLayer, setShowKommuneLayer] = useState(false);
  useEffect(() => {
    setKommuneLayers(showKommuneLayer ? [kommuneLayer] : []);
  }, [showKommuneLayer]);

  // useEffect som setter alle kommuner
  useEffect(() => {
    kommuneSource.on("change", () => {
      setAllKommuner(kommuneSource.getFeatures());
      // useEffect som legger til click(for klikk på kommune) event handler på kartet
      map.on("click", handleMapClick);
      // cleanup function for å fjerne event listeners når komponenten unmountes slik at man unngår memory leaks
      return () => {
        map.un("click", handleMapClick);
      };
    });
  }, []);

  function handleMapClick(e: MapBrowserEvent) {
    const kommune = kommuneSource.getFeaturesAtCoordinate(e.coordinate);
    setSelectedKommune(kommune.length > 0 ? kommune[0] : undefined);
  }

  return (
    <button onClick={() => setShowKommuneLayer(!showKommuneLayer)}>
      <input
        type={"checkbox"}
        checked={showKommuneLayer}
        onChange={() => setShowKommuneLayer(!showKommuneLayer)}
      />
      vis kommuner
    </button>
  );
}
