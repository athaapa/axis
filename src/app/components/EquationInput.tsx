"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const EditableMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.EditableMathField),
  { ssr: false }
);

interface EquationInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onBackspace?: () => void;
  placeholder?: string;
  equationId?: string;
  shouldFocus?: boolean;
  canDelete?: boolean;
}

export default function EquationInput({
  value,
  onChange,
  onEnter,
  onArrowUp,
  onArrowDown,
  onBackspace,
  equationId,
  shouldFocus = false,
  canDelete = true,
}: EquationInputProps) {
  const [mathField, setMathField] = React.useState<any>(null);

  useEffect(() => {
    if (shouldFocus && mathField) {
      mathField.focus();
    }
  }, [shouldFocus, mathField]);
  return (
    <div
      className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700"
      style={{ marginBottom: "10px" }}
      data-equation-id={equationId}
    >
      <EditableMathField
        latex={value}
        onChange={(mathField) => {
          const latex = mathField.latex();
          onChange(latex);
          setMathField(mathField);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter?.();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onArrowUp?.();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onArrowDown?.();
          } else if (e.key === "Backspace" && value === "" && canDelete) {
            e.preventDefault();
            onBackspace?.();
          }
        }}
        style={{
          minHeight: "32px",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          padding: "8px 12px",
          width: "92%",
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#fff",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          cursor: "text",
          caretColor: "#fff",
        }}
      />
    </div>
  );
}
