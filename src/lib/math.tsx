import {
    evaluate,
    OperatorNode,
    MathNode,
    EvalFunction,
    simplify,
} from "mathjs";
import { useMemo } from "react";
import { parseTex } from "tex-math-parser";
import { Vector3 } from "three";
import * as THREE from "three";

/**
 * Parses a LaTeX expression into a math.js expression tree
 * @param expr LaTeX expression to parse into math.js expression tree
 * @returns node MathNode that represents the root node of the expression tree
 */
export function parseLatex(expr: string) {
    const expressions = expr.split("=");
    if (expressions.length == 2) {
        const leftExpression = parseTex(expressions[0]);
        const rightExpression = parseTex(expressions[1]);

        const rootNode = new OperatorNode("-", "subtract", [
            leftExpression,
            rightExpression,
        ]);
        return rootNode;
    }

    return parseTex(expr);
}
/**
 * Returns a list containing the free variables in the expression tree,
 * @param node root of the math.js expression tree
 * @returns list containing the free variables in the expression tree
 */
function getFreeVariables(node: MathNode) {
    const variables: string[] = [];
    node.traverse((node: any) => {
        if (node.type == "SymbolNode" && ["x", "y", "z"].includes(node.name)) {
            variables.push(node.name);
        }
    });
    return variables;
}

/**
 * Checks whether or not a number is finite.
 * @param value number to check if finite,
 * @returns true if value is finite, false if it is not.
 */
function isFiniteNumber(value: number) {
    return Number.isFinite(value);
}

/**
 *
 * @param evalFunc function that we are interpolating contour of
 * @param p1 first point
 * @param p2 second point
 * @param isoLevel the isolevel of the interpolation
 * @returns the interpolated value betwen p1 and p2
 */
function interpolate(
    evalFunc: EvalFunction,
    p1: Vector3,
    p2: Vector3,
    isoLevel = 0
) {
    const v1 = evalFunc.evaluate({ x: p1.x, y: p1.y });
    const v2 = evalFunc.evaluate({ x: p2.x, y: p2.y });
    const t = (isoLevel - v1) / (v2 - v1);
    const x = p1.x + t * (p2.x - p1.x);
    const y = p1.y + t * (p2.y - p1.y);

    return new Vector3(x, y, 0);
}

/**
 *
 * @param evalFunc function to find the contour of
 * @param center center point of marched squares
 * @param numCellsWide number of cells that go in either X direction
 * @param numCellsLong number of cells that go in either Y direction
 * @returns a list of line segments that describe the contour of evalFunc
 */
export function marchSquares(
    evalFunc: EvalFunction,
    center: Vector3,
    numCellsWide: number,
    numCellsLong: number
) {
    const lookupTable = {
        0: [],
        1: [[3, 2]],
        2: [[2, 1]],
        3: [[3, 1]],
        4: [[0, 1]],
        5: [
            [0, 3],
            [1, 2],
        ],
        6: [[0, 2]],
        7: [[0, 3]],
        8: [[0, 3]],
        9: [[0, 2]],
        10: [
            [0, 1],
            [2, 3],
        ],
        11: [[0, 1]],
        12: [[3, 1]],
        13: [[2, 1]],
        14: [[3, 2]],
        15: [],
    };

    function getEdgeVertices(edgeIndex: number, vertices: Vector3[]) {
        switch (edgeIndex) {
            case 0:
                return [vertices[2], vertices[3]]; // top edge
            case 1:
                return [vertices[3], vertices[1]]; // right edge
            case 2:
                return [vertices[0], vertices[1]]; // bottom edge
            case 3:
                return [vertices[2], vertices[0]]; // left edge
            default:
                throw new Error("Invalid edge index");
        }
    }

    const lineSegments: Array<[Vector3, Vector3]> = []; // store segments as pairs of points

    // Center is the bottom left vertice of the center cell
    const cellLength = 0.5;
    for (let x = -numCellsWide; x <= numCellsWide; x += cellLength) {
        for (let y = -numCellsLong; y <= numCellsLong; y += cellLength) {
            const vertices = [
                center.clone().add(new Vector3(x, y, 0)),
                center.clone().add(new Vector3(x + cellLength, y, 0)),
                center.clone().add(new Vector3(x, y + cellLength, 0)),
                center
                    .clone()
                    .add(new Vector3(x + cellLength, y + cellLength, 0)),
            ];
            const evaluate = evalFunc.evaluate;

            let index = 0;

            const topLeft = vertices[2];
            const topRight = vertices[3];
            const bottomRight = vertices[1];
            const bottomLeft = vertices[0];

            if (evaluate({ x: topLeft.x, y: topLeft.y }) > 0) index |= 8; // Top left
            if (evaluate({ x: topRight.x, y: topRight.y }) > 0) index |= 4; // Top right
            if (evaluate({ x: bottomRight.x, y: bottomRight.y }) > 0)
                index |= 2; // Bottom right
            if (evaluate({ x: bottomLeft.x, y: bottomLeft.y }) > 0) index |= 1; // Bottom left

            const pairList = lookupTable[index];

            for (const edgePair of pairList) {
                const [edgeA, edgeB] = edgePair;

                // Get edge vertices of both edges
                const [p1a, p1b] = getEdgeVertices(edgeA, vertices);
                const [p2a, p2b] = getEdgeVertices(edgeB, vertices);

                // Interpolate crossing points on the edges
                const interpA = interpolate(evalFunc, p1a, p1b, 0);
                const interpB = interpolate(evalFunc, p2a, p2b, 0);

                // Add line segment connecting these points
                lineSegments.push([interpA, interpB]);
            }
        }
    }
    return lineSegments;
}

/**
 *
 * @param segments list of line segments generated from marching squares algorithm
 * @returns
 */
export function connectSegments(segments: [THREE.Vector3, THREE.Vector3][]) {
    const chains: THREE.Vector3[][] = [];

    const remaining = [...segments];
    while (remaining.length > 0) {
        const chain = [...remaining.pop()!];
        let extended = true;

        while (extended) {
            extended = false;

            for (let i = 0; i < remaining.length; i++) {
                const [a, b] = remaining[i];
                const start = chain[0];
                const end = chain[chain.length - 1];

                if (a.distanceTo(end) < 1e-6) {
                    chain.push(b);
                    remaining.splice(i, 1);
                    extended = true;
                    break;
                } else if (b.distanceTo(end) < 1e-6) {
                    chain.push(a);
                    remaining.splice(i, 1);
                    extended = true;
                    break;
                } else if (a.distanceTo(start) < 1e-6) {
                    chain.unshift(b);
                    remaining.splice(i, 1);
                    extended = true;
                    break;
                } else if (b.distanceTo(start) < 1e-6) {
                    chain.unshift(a);
                    remaining.splice(i, 1);
                    extended = true;
                    break;
                }
            }
        }

        chains.push(chain);
    }

    return chains;
}

function projectPointToCurve(
    point: THREE.Vector3,
    evalFunc: any,
    maxIterations: number = 10
): THREE.Vector3 {
    let x = point.x;
    let y = point.y;

    const h = 0.001;

    for (let i = 0; i < maxIterations; i++) {
        try {
            const f = evalFunc.evaluate({ x, y });

            // If already close enough to curve, return
            if (Math.abs(f) < 0.0001) break;

            // Compute numerical gradient
            const fx =
                (evalFunc.evaluate({ x: x + h, y }) -
                    evalFunc.evaluate({ x: x - h, y })) /
                (2 * h);
            const fy =
                (evalFunc.evaluate({ x, y: y + h }) -
                    evalFunc.evaluate({ x, y: y - h })) /
                (2 * h);

            const gradMagSq = fx * fx + fy * fy;
            if (gradMagSq < 0.000001) break; // Gradient too small

            // Move perpendicular to gradient towards f=0
            // Use a smaller step size for stability
            const stepSize = 0.5;
            const move = (f / gradMagSq) * stepSize;
            x -= fx * move;
            y -= fy * move;
        } catch (e) {
            // If evaluation fails, return original point
            return point;
        }
    }

    return new THREE.Vector3(x, y, 0);
}

/**
 *
 * @param points list of points to smooth
 * @param evalFunc function to smooth them against
 * @param iterations max number of iterations to smooth
 * @param strength strength of the smoothing
 * @returns new list of points that have been smoothed against evalFunc
 */
export function smoothChain(
    points: THREE.Vector3[],
    evalFunc: any,
    iterations: number = 2,
    strength: number = 0.5
): THREE.Vector3[] {
    if (points.length < 3) return points;

    let smoothed = points.map((p) => p.clone());

    for (let iter = 0; iter < iterations; iter++) {
        const temp = [smoothed[0].clone()];

        for (let i = 1; i < smoothed.length - 1; i++) {
            const prev = smoothed[i - 1];
            const curr = smoothed[i];
            const next = smoothed[i + 1];

            // Average with neighbors
            const avg = new THREE.Vector3()
                .add(prev)
                .add(curr)
                .add(next)
                .divideScalar(3);

            // Blend between current and averaged
            const blended = curr.clone().lerp(avg, strength);

            // Project back onto curve
            const projected = projectPointToCurve(blended, evalFunc);

            // Safety check: if projection moved point too far, use blended instead
            const dist = projected.distanceTo(blended);
            if (dist > 0.5) {
                temp.push(blended);
            } else {
                temp.push(projected);
            }
        }

        temp.push(smoothed[smoothed.length - 1].clone());
        smoothed = temp;
    }

    return smoothed;
}
