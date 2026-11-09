import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl bg-surface-elevated ${className}`}
      style={{ minHeight: 80 }}
    />
  );
};

export default Skeleton;
