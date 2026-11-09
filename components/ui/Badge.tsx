import React from "react";
import cn from "@/lib/utils/cn";

export const Badge: React.FC<{
  variant?:
    | "active"
    | "confirmed"
    | "female"
    | "preferred"
    | "verified"
    | "default";
  children: React.ReactNode;
}> = ({ variant = "default", children }) => {
  const styles: Record<string, string> = {
    active:
      "bg-brand text-white rounded-full px-2.5 py-0.5 text-[10px] font-bold",
    confirmed:
      "bg-brand-light text-brand border border-[#F2C4CB] rounded-full px-3 py-1 text-[11px] font-medium",
    female: "bg-brand-light text-brand rounded-full px-3 py-1 text-[11px]",
    preferred: "bg-brand-light text-brand rounded-full px-3 py-1 text-[11px]",
    verified:
      "bg-brand text-white rounded-full px-2.5 py-1 text-[10px] font-semibold",
    default:
      "bg-white text-ink border border-[#E8E8E8] rounded-full px-3 py-1 text-[11px]",
  };
  return (
    <span className={cn("inline-flex items-center", styles[variant])}>
      {children}
    </span>
  );
};

export default Badge;
