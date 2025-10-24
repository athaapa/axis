"use client";

import { Stats } from "@react-three/drei";
import CanvasScene from "./components/CanvasScene";
import MathInput from "./components/MathInput";
import EquationPanel from "./components/EquationPanel";

export default function Page() {
  return (
    <div
      id="canvas-container"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      <CanvasScene />

      <div style={{ zIndex: 10 }}>
        <EquationPanel />
      </div>
    </div>
  );
}
