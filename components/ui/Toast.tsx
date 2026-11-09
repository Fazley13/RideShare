"use client";
import React, { useEffect } from "react";
import cn from "@/lib/utils/cn";

export const Toast: React.FC<{
  type?: "success" | "error";
  message: string;
  onClose?: () => void;
}> = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles =
    type === "success"
      ? "bg-[#F0FBF4] border border-[#27AE60]/30 text-[#27AE60]"
      : "bg-[#FEF0F0] border border-brand/30 text-brand";

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-5 py-3 shadow-float flex items-center gap-2 text-[14px] font-medium",
        styles,
      )}
    >
      <div>{message}</div>
    </div>
  );
};

export default Toast;
