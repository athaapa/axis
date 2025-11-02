import {
    connectSegments,
    isValidLatexFunction,
    marchSquares,
    parseLatex,
    smoothChain,
} from "@/lib/math";
import { useMemo } from "react";
import * as THREE from "three";

export default function Curve({
    expr,
    color,
}: {
    expr: string;
    color: string;
}) {
    const { chains, evalFunc } = useMemo(() => {
        console.log(expr);
        if (!isValidLatexFunction(expr)) {
            return { chains: [], evalFunc: null };
        }
        const node = parseLatex(expr);
        const code = node.compile();
        const lineSegments = marchSquares(
            code,
            new THREE.Vector3(0, 0, 0),
            50,
            50
        );
        console.log(node);

        const chains = connectSegments(lineSegments);
        //console.log(lineSegments);

        return { chains, evalFunc: code };
    }, [expr]);

    return (
        <>
            {chains.map((points, i) => (
                <TubeChain
                    key={i}
                    points={points}
                    evalFunc={evalFunc}
                    color={color}
                />
            ))}
        </>
    );
}

function TubeChain({
    points,
    evalFunc,
    color,
}: {
    points: THREE.Vector3[];
    evalFunc: any;
    color: string;
}) {
    const curve = useMemo(() => {
        const smoothed = smoothChain(points, evalFunc, 3, 0.5);
        return new THREE.CatmullRomCurve3(smoothed);
    }, [points, evalFunc]);

    return (
        <mesh>
            <tubeGeometry args={[curve, 200, 0.025, 8, false]} />
            <meshStandardMaterial
                color={color}
                emissive="#ff2222"
                emissiveIntensity={0.4}
            />
        </mesh>
    );
}
