"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import GraphCurve from "./graph-curve";
import WorldGrid from "./grid";
import { useMemo } from "react";

export default function CanvasScene() {
  // Generate points for a sine wave
  const sineWavePoints = useMemo(() => {
    const points: number[][] = [];
    const numPoints = 200;
    const amplitude = 2;
    const frequency = 0.5;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / (numPoints - 1)) * 4 * Math.PI - 2 * Math.PI; // -2π to 2π
      const x = t;
      const y = amplitude * Math.sin(frequency * t);
      const z = 0;
      points.push([x, y, z]);
    }

    return points;
  }, []);

  return (
    <div
      id="canvas-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <ambientLight />
        <WorldGrid />

        {/* Add the sine wave */}
        <GraphCurve points={sineWavePoints} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
