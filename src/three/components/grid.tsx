import { Grid } from "@react-three/drei";

export default function WorldGrid() {
    return (
        <Grid
            position={[0, -1, 0]}
            rotation-x={Math.PI / 2}
            args={[10, 10]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={0.5}
            sectionThickness={1}
            sectionColor="#000000ff"
            fadeDistance={30}
            fadeStrength={1}
            infiniteGrid
            side={2}
        />
    );
}
