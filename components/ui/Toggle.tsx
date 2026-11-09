"use client";
import React from "react";
import cn from "@/lib/utils/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="text-ink text-sm font-medium">{label}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-all",
          checked ? "bg-brand shadow-button" : "bg-[#E8E8E8]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
};

export default Toggle;
