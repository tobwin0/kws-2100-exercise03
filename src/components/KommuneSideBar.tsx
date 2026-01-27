import type { Feature, View } from "ol";
import type Geometry from "ol/geom/Geometry.js";
import { getCenter } from "ol/extent.js";

export function KommuneSideBar({
  allKommuner,
  view,
  setSelectedKommune,
}: {
  allKommuner: Feature<Geometry>[];
  view: View;
  setSelectedKommune: (kommune: Feature<Geometry> | undefined) => void;
}) {
  function handleClickKommune(kommune: Feature) {
    setSelectedKommune(kommune);
    const geometry = kommune.getGeometry();
    view.animate({
      center: getCenter(geometry!.getExtent()),
      zoom: 10,
    });
  }

  return (
    <aside>
      <h2>Kommuner</h2>
      <ul>
        {allKommuner
          ?.sort((a, b) =>
            a
              .getProperties()
              ["kommunenavn"].localeCompare(b.getProperties()["kommunenavn"]),
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
  );
}
