import { useMemo } from "react";
import * as THREE from "three";

type GraphCurveProps = {
  points: number[][];
};

export default function GraphCurve({ points }: GraphCurveProps) {
  // Create Three.js curve from points
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p))
    );
  }, [points]);

  // Create tube geometry around the curve
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, 0.05, 8, false);
  }, [curve]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
