import { Layer } from "ol/layer.js";
import React, { useEffect, useState } from "react";
import { fylkeLayer } from "../app/layers.js";

export function FylkesLayerCheckbox({
  setFylkesLayers,
}: {
  setFylkesLayers(layers: Layer[]): void;
}) {
  const [showFylkeLayer, setShowFylkeLayer] = useState(false);

  useEffect(() => {
    setFylkesLayers(showFylkeLayer ? [fylkeLayer] : []);
  }, [showFylkeLayer]);
  return (
    <>
      <button onClick={() => setShowFylkeLayer(!showFylkeLayer)} tabIndex={-1}>
        <input
          type={"checkbox"}
          checked={showFylkeLayer}
          onChange={(e) => setShowFylkeLayer(e.target.checked)}
        />
        Vis fylker
      </button>
    </>
  );
}
