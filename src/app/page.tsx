"use client";

import { Stats } from "@react-three/drei";
import CanvasScene from "../three/components/canvas-scene";
import EquationPanel from "../components/ui/equation-panel";
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
            equation: "",
            color: "#3b82f6",
            visible: true,
        },
    ]);

    return (
        <div className="w-screen h-screen relative bg-zinc-950 overflow-hidden">
            <CanvasScene equations={equations} />

            <EquationPanel equations={equations} setEquations={setEquations} />
        </div>
    );
}
