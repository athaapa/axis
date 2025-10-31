import { useMemo } from "react";
import * as THREE from "three";

interface PlotPointProps {
    point: THREE.Vector3;
    color?: string;
    size?: number;
}

export default function PlotPoint({
    point,
    color = "#ffffff",
    size = 0.05,
}: PlotPointProps) {
    const sphereGeometry = useMemo(() => {
        return new THREE.SphereGeometry(size, 16, 16);
    }, [size]);

    return (
        <mesh position={point} geometry={sphereGeometry}>
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}
