"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import GraphCurve from "./GraphCurve";
import WorldGrid from "./WorldGrid";

export default function CanvasScene() {
  return (
    <div id="canvas-container" style={{ width: "100vw", height: "50vw" }}>
      <Canvas>
        <ambientLight />
        <WorldGrid />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
