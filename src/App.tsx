import { MapView } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useEffect, useState } from "react";
import "./App.css";
import { WebMercatorViewport } from "deck.gl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { bbox } from "@turf/turf";

const COORDS = [
  [-80.5406191984052, 43.48307379941281],
  [-80.54061875738378, 43.48307378891819],
  [-80.54061831814083, 43.48307375835162],
  [-80.54061788240979, 43.48307370783372],
  [-80.54061745191034, 43.483073637563855],
  [-80.54061702834143, 43.48307354781936],
  [-80.5406166133747, 43.48307343895439],
  [-80.54061620864785, 43.48307331139863],
  [-80.54061581575816, 43.48307316565544],
  [-80.54061543625613, 43.483073002300024],
  [-80.54061507163955, 43.48307282197707],
  [-80.54061472334736, 43.48307262539822],
  [-80.54061439275412, 43.4830724133393],
  [-80.5406140811645, 43.48307218663719],
  [-80.54061378980828, 43.483071946186584],
  [-80.54061351983522, 43.483071692936456],
  [-80.54061327231084, 43.48307142788623],
  [-80.54061304821197, 43.48307115208196],
  [-80.54061284842304, 43.48307086661212],
  [-80.54061267373253, 43.48307057260331],
  [-80.54061252482987, 43.48307027121588],
  [-80.54061240230267, 43.48306996363925],
  [-80.54061230663453, 43.48306965108729],
  [-80.54061223820301, 43.48306933479349],
  [-80.54061219727816, 43.48306901600613],
  [-80.54061218402148, 43.48306869598375],
];

const useCountLoop = (animationSpeed: number, arrayLength: number) => {
  const [count, setCount] = useState(1);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    const updateCount = () => {
      if (isIncreasing) {
        if (count < arrayLength) {
          setCount(count + 1);
        } else {
          setIsIncreasing(false);
        }
      } else {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setIsIncreasing(true);
        }
      }
    };

    const interval = setInterval(updateCount, animationSpeed);

    return () => clearInterval(interval);
  }, [count, isIncreasing, arrayLength, animationSpeed]);

  return count;
};

function App() {
  const [zoomLevel, setZoomLevel] = useState(24);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const count = useCountLoop(animationSpeed, COORDS.length);
  const lastCoord = COORDS[count - 1];

  const data = {
    type: "Feature",
    properties: {
      featureType: "entrance-direction",
    },
    geometry: {
      type: "MultiLineString",
      coordinates: [COORDS.slice(0, count)],
    },
  };
  const viewport = new WebMercatorViewport({
    zoom: zoomLevel,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [minLng, minLat, maxLng, maxLat] = bbox(data);
  const v = viewport.fitBounds([
    [minLng, minLat],
    [maxLng, maxLat],
  ]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 15,
          width: 150,
          zIndex: 2,
        }}
      >
        <input
          style={{ width: "100%" }}
          type="range"
          defaultValue={24}
          max={26}
          min={18}
          step={0.1}
          onChange={(e) => setZoomLevel(e.target.valueAsNumber)}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 15,
          width: 150,
          zIndex: 2,
        }}
      >
        <p>{lastCoord.join(" ")}</p>
        <input
          style={{ width: "100%" }}
          type="range"
          defaultValue={100}
          max={1000}
          min={25}
          step={5}
          onChange={(e) => setAnimationSpeed(e.target.valueAsNumber)}
        />
      </div>
      <DeckGL
        initialViewState={{
          ...v,
          zoom: zoomLevel,
          pitch: 0,
          bearing: 0,
        }}
        layers={[
          new (GeoJsonLayer as any)({
            id: "layer",
            data,
            pickable: false,
            stroked: true,
            filled: false,
            extruded: false,
            getLineWidth: 0.01,
          }),
        ]}
        views={[
          new MapView({
            doubleClickZoom: false,
            dragPan: true,
          }),
        ]}
      />
    </div>
  );
}

export default App;
