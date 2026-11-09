import React from "react";

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({
  value,
  className = "",
}) => {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full bg-[#E8E8E8] rounded-full h-2 ${className}`}>
      <div
        className="bg-brand h-2 rounded-full"
        style={{ width: `${percent}%`, transition: "width 700ms ease-out" }}
      />
    </div>
  );
};

export default ProgressBar;
