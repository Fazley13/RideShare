"use client";
import React from "react";
import cn from "@/lib/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "standard" | "highlight" | "tinted";
  floating?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = "standard",
  floating = false,
  className,
  children,
  ...rest
}) => {
  const variants: Record<string, string> = {
    standard:
      "bg-white rounded-3xl p-4 shadow-card border border-[#F0EFEB] transition-shadow duration-300",
    highlight: "bg-brand text-white rounded-3xl p-5 shadow-button",
    tinted: "bg-brand-light rounded-2xl p-4 border border-[#F2C4CB]",
  };

  return (
    <motion.div
      whileHover={
        floating
          ? { y: -6, boxShadow: "0 18px 40px rgba(17,17,17,0.12)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={cn(variants[variant], className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Card;
