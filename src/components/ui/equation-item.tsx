"use client";

import React, { useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

const EditableMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.EditableMathField),
  { ssr: false }
);

interface Equation {
  id: string;
  equation: string;
  color: string;
  visible: boolean;
}

interface EquationItemProps {
  equation: Equation;
  onUpdate: (id: string, equation: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function EquationItem({
  equation,
  onUpdate,
  onDelete,
  onToggleVisibility,
}: EquationItemProps) {
  const [mathField, setMathField] = React.useState<any>(null);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
      {/* Color Dot */}
      <div
        className="w-3 h-3 rounded-full shrink-0 cursor-pointer"
        style={{ backgroundColor: equation.color }}
        onClick={() => onToggleVisibility(equation.id)}
      />

      {/* MathQuill Equation Input */}
      <div className="flex-1">
        <EditableMathField
          latex={equation.equation}
          onChange={(mathField) => {
            const latex = mathField.latex();
            onUpdate(equation.id, latex);
            setMathField(mathField);
          }}
          style={{
            minHeight: "24px",
            border: "none",
            backgroundColor: "transparent",
            color: "#fff",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            cursor: "text",
            caretColor: "#fff",
            width: "100%",
            outline: "none",
          }}
        />
      </div>

      {/* Delete Button */}
      <button
        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
        onClick={() => onDelete(equation.id)}
      >
        <Trash2 className="w-4 h-4 text-white/60" />
      </button>
    </div>
  );
}
