import { Settings, X, Plus } from "lucide-react";
import { useState } from "react";
import EquationItem from "./equation-item";

interface Equation {
  id: string;
  equation: string;
  color: string;
  visible: boolean;
}

interface FloatingEquationPanelProps {
  equations: Equation[];
  onEquationsChange?: (equations: Equation[]) => void;
}

export default function EquationPanel({
  equations: initialEquations,
  onEquationsChange,
}: FloatingEquationPanelProps) {
  const [equations, setEquations] = useState<Equation[]>(initialEquations);

  const handleUpdateEquation = (id: string, equation: string) => {
    const updatedEquations = equations.map((eq) =>
      eq.id === id ? { ...eq, equation } : eq
    );
    setEquations(updatedEquations);
    onEquationsChange?.(updatedEquations);
  };

  const handleDeleteEquation = (id: string) => {
    const updatedEquations = equations.filter((eq) => eq.id !== id);
    setEquations(updatedEquations);
    onEquationsChange?.(updatedEquations);
  };

  const handleToggleVisibility = (id: string) => {
    const updatedEquations = equations.map((eq) =>
      eq.id === id ? { ...eq, visible: !eq.visible } : eq
    );
    setEquations(updatedEquations);
    onEquationsChange?.(updatedEquations);
  };

  const handleAddEquation = () => {
    const newEquation: Equation = {
      id: Date.now().toString(),
      equation: "",
      color: "#3b82f6",
      visible: true,
    };
    const updatedEquations = [...equations, newEquation];
    setEquations(updatedEquations);
    onEquationsChange?.(updatedEquations);
  };

  return (
    <div className="absolute top-8 right-8 w-96 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl bg-zinc-900/40 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-white/90 font-bold">Equations</h2>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-white/60" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Equation List */}
      <div className="p-4 space-y-2">
        {equations.map((eq) => (
          <EquationItem
            key={eq.id}
            equation={eq}
            onUpdate={handleUpdateEquation}
            onDelete={handleDeleteEquation}
            onToggleVisibility={handleToggleVisibility}
          />
        ))}
      </div>
    </div>
  );
}
