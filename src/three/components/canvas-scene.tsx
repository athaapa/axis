"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import WorldGrid from "./grid";
import { useMemo } from "react";
import PlotPoint from "./plot-point";
import Curve from "./graphs/curve";
import { Vector3 } from "three";
import { randInt } from "three/src/math/MathUtils.js";

const COLORS = [
    "#FFB3BA", // Pastel Pink
    "#FFDFBA", // Pastel Peach
    "#FFFFBA", // Pastel Yellow
    "#BAFFC9", // Pastel Mint
    "#BAE1FF", // Pastel Blue
    "#D4BAFF", // Pastel Lavender
    "#FFB3D9", // Pastel Rose
    "#C9E4C5", // Pastel Sage
    "#FFB5A7", // Pastel Coral
    "#CCCCFF", // Pastel Periwinkle
];

export default function CanvasScene() {
    const expr = "(x^{2}+y^{2}-2x)^{2}=4(x^{2}+y^{2})";
    const expr2 = "y^{2}(y^{2}-4)=x^{2}(x^{2}-5)";
    const expr3 = "x^4=x^2+y^2";
    const expr4 = "x^3+y^3=3xy";
    const expr5 = "x^2+y^2=4";

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
            <Canvas camera={{ position: [2.5, 2.5, 2.5], up: [0, 0, 1] }}>
                <color attach="background" args={["black"]} />
                <ambientLight />
                <WorldGrid />

                {/**<Curve expr={expr2} color={COLORS[randInt(0, COLORS.length)]} /> */}
                <Curve expr={expr2} color={COLORS[randInt(0, COLORS.length)]} />

                <OrbitControls />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}
