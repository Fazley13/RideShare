"use client";
import React, { useState } from "react";
import cn from "@/lib/utils/cn";
import { motion } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<any>;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  className,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn("w-full")}>
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-1 block">
          {label}
        </label>
      )}
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 4px rgba(200, 16, 46, 0.14)"
            : "0 0 0 0 rgba(200, 16, 46, 0)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex items-center gap-3 bg-surface-elevated border border-[#E8E8E8] rounded-2xl px-4 py-3.5 transition-colors duration-200 focus-within:border-brand/60"
      >
        {Icon ? (
          <span className="text-ink text-[18px]">
            <Icon />
          </span>
        ) : null}
        <input
          className={cn(
            "w-full bg-transparent outline-none text-ink placeholder:text-ink-muted",
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </motion.div>
    </div>
  );
};

export default Input;
