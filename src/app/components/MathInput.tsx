"use client";
import "mathquill/build/mathquill.css";

import { useState } from "react";
import dynamic from "next/dynamic";
import { parseMath } from "latex-math";

const EditableMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.EditableMathField),
  { ssr: false }
);

export default function MathInput() {
  const [latex, setLatex] = useState("");

  return (
    <div>
      <div className="w-full max-w-md">
        <EditableMathField
          latex={latex}
          onChange={(mathField) => {
            setLatex(mathField.latex());
            console.log(parseMath(mathField.latex()));
          }}
          style={{
            minHeight: "40px",
            border: "1px solid #ccc",
            padding: "5px",
            width: "100%",
          }}
        />
        <p className="mt-2 text-center">LaTeX output: </p>
      </div>
    </div>
  );
}
