"use client";

import { useRef, useState, useEffect } from "react";
import EquationInput from "./EquationInput";

interface Equation {
  id: string;
  expression: string;
}

export default function EquationPanel() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const [equations, setEquations] = useState<Equation[]>([
    { id: "1", expression: "" },
  ]);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);

  const checkIfNearEdge = (e: React.MouseEvent) => {
    if (!panelRef.current) return false;

    const rect = panelRef.current.getBoundingClientRect();
    const edgeThreshold = 25; // pixels from edge to allow dragging

    return (
      e.clientX - rect.left < edgeThreshold || // left edge
      rect.right - e.clientX < edgeThreshold || // right edge
      e.clientY - rect.top < edgeThreshold || // top edge
      rect.bottom - e.clientY < edgeThreshold // bottom edge
    );
  };

  const handlePanelMouseMove = (e: React.MouseEvent) => {
    if (!dragging) {
      setIsNearEdge(checkIfNearEdge(e));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;

    if (!checkIfNearEdge(e)) return;

    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const updateEquation = (id: string, expression: string) => {
    setEquations(
      equations.map((eq) => (eq.id === id ? { ...eq, expression } : eq))
    );
  };

  const addNewEquation = (afterId: string) => {
    const newId = Date.now().toString();
    const afterIndex = equations.findIndex((eq) => eq.id === afterId);
    const newEquations = [...equations];
    newEquations.splice(afterIndex + 1, 0, { id: newId, expression: "" });
    setEquations(newEquations);

    // Set focus target to trigger focus in the new input
    setFocusTarget(newId);

    // Clear focus target after a short delay
    setTimeout(() => {
      setFocusTarget(null);
    }, 100);
  };

  const focusPreviousEquation = (currentId: string) => {
    const currentIndex = equations.findIndex((eq) => eq.id === currentId);
    if (currentIndex > 0) {
      const previousId = equations[currentIndex - 1].id;
      setFocusTarget(previousId);
      setTimeout(() => {
        setFocusTarget(null);
      }, 100);
    }
  };

  const focusNextEquation = (currentId: string) => {
    const currentIndex = equations.findIndex((eq) => eq.id === currentId);
    if (currentIndex < equations.length - 1) {
      const nextId = equations[currentIndex + 1].id;
      setFocusTarget(nextId);
      setTimeout(() => {
        setFocusTarget(null);
      }, 100);
    }
  };

  const deleteEquation = (equationId: string) => {
    if (equations.length > 1) {
      const currentIndex = equations.findIndex((eq) => eq.id === equationId);
      const newEquations = equations.filter((eq) => eq.id !== equationId);
      setEquations(newEquations);

      // Focus the previous equation if available, otherwise focus the next one
      if (currentIndex > 0) {
        const previousId = newEquations[currentIndex - 1].id;
        setFocusTarget(previousId);
      } else if (newEquations.length > 0) {
        const nextId = newEquations[0].id;
        setFocusTarget(nextId);
      }

      setTimeout(() => {
        setFocusTarget(null);
      }, 100);
    }
  };

  return (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handlePanelMouseMove}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "340px",
        maxWidth: "340px",
        background: "rgba(15, 15, 15, 0.95)",
        backdropFilter: "blur(12px)",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        cursor: dragging ? "grabbing" : isNearEdge ? "grab" : "default",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "8px",
        }}
      >
        Equations
      </div>

      <div
        style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}
      >
        {equations.map((equation, index) => (
          <EquationInput
            key={equation.id}
            equationId={equation.id}
            value={equation.expression}
            onChange={(value) => updateEquation(equation.id, value)}
            onEnter={() => addNewEquation(equation.id)}
            onArrowUp={() => focusPreviousEquation(equation.id)}
            onArrowDown={() => focusNextEquation(equation.id)}
            onBackspace={() => deleteEquation(equation.id)}
            shouldFocus={focusTarget === equation.id}
            canDelete={equations.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
