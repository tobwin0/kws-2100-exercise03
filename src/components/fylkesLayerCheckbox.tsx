import { Layer } from "ol/layer.js";
import React, { useEffect, useState } from "react";
import { fylkeLayer, fylkeSource } from "../app/layers.js";
import { type Feature, Map, MapBrowserEvent } from "ol";
import type { FeatureLike } from "ol/Feature.js";
import Style from "ol/style/Style.js";
import { Text } from "ol/style.js";

export function FylkesLayerCheckbox({
  setFylkesLayers,
  map,
}: {
  setFylkesLayers(layers: Layer[]): void;
  map: Map;
}) {
  const [showFylkeLayer, setShowFylkeLayer] = useState(false);
  useEffect(() => {
    setFylkesLayers(showFylkeLayer ? [fylkeLayer] : []);
    if (showFylkeLayer) map.on("pointermove", handlePointerMove);

    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [showFylkeLayer]);

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
