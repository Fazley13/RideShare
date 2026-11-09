"use client";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function FAB() {
  return (
    <Link
      href="/rides/post"
      className="fixed right-4 bottom-[84px] z-40 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-button hover:scale-110 transition-transform duration-200"
    >
      <Plus size={22} />
    </Link>
  );
}
