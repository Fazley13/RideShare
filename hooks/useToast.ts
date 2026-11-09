"use client";

import { useToast as useToastContext } from "@/components/ToastContext";

export function useToast() {
  return useToastContext();
}
