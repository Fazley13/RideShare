"use client";
import React from "react";
import cn from "@/lib/utils/cn";
import { motion } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leading?: React.ComponentType<any> | null;
  size?: "sm" | "md" | "lg";
  tapScale?: number;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  leading: Leading,
  className,
  children,
  size = "md",
  tapScale = 0.95,
  ...rest
}) => {
  const sizeCls = {
    sm: "px-4 py-2 text-[14px] min-h-[44px]",
    md: "px-6 py-3.5 text-[15px] min-h-[46px]",
    lg: "px-8 py-4 text-[16px] min-h-[50px]",
  }[size];

  const base =
    "rounded-2xl font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation";

  const variants: Record<ButtonVariant, string> = {
    primary: `bg-brand text-white shadow-button hover:bg-brand-hover hover:shadow-button-hover ${sizeCls}`,
    secondary: `bg-white text-ink border border-[#E8E8E8] hover:border-brand hover:text-brand hover:bg-brand-light ${sizeCls}`,
    ghost: `bg-transparent text-ink-secondary hover:bg-surface-elevated hover:text-ink px-3 py-2.5 min-h-[44px] rounded-xl`,
    icon: `bg-transparent h-11 w-11 rounded-xl text-ink-secondary hover:text-ink hover:bg-surface-elevated`,
  };

  return (
    <motion.div
      whileTap={rest.disabled ? undefined : { scale: tapScale }}
      className="inline-flex"
    >
      <button className={cn(base, variants[variant], className)} {...rest}>
        {Leading ? <Leading /> : null}
        {children}
      </button>
    </motion.div>
  );
};

export default Button;
