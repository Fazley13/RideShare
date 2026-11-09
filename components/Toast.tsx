"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />,
    error: <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />,
    info: <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div className="absolute top-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-[380px] pointer-events-auto flex items-center justify-between gap-3 border rounded-2xl p-4 shadow-lg ${bgColors[type]}`}
      >
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="text-sm font-semibold leading-snug">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4 opacity-50" />
        </button>
      </motion.div>
    </div>
  );
}
