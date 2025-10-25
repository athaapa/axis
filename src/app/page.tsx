"use client";

import { Stats } from "@react-three/drei";
import CanvasScene from "./components/canvas-scene";
import EquationPanel from "./ui/equation-panel";
import { useState } from "react";

interface Equation {
  id: string;
  equation: string;
  color: string;
  visible: boolean;
}

export default function Page() {
  const [equations, setEquations] = useState<Equation[]>([
    {
      id: "1",
      equation: "y = sin(x) * cos(z)",
      color: "#3b82f6",
      visible: true,
    },
  ]);

  return (
    <div className="w-screen h-screen bg-zinc-950 relative overflow-hidden">
      {/* 3D Graph Canvas */}
      <CanvasScene />

      {/* Floating Equation Panel */}
      <EquationPanel equations={equations} />
    </div>
  );
}
