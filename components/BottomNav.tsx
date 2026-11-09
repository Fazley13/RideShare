"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  PlusCircle,
  Car,
  Info,
  Star,
  LogOut,
} from "lucide-react";

interface BottomNavProps {
  activeTab?: string;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("rideshare_token");
    localStorage.removeItem("rideshare_user");
    router.push("/");
  };

  const tabs = [
    { label: "SEARCH", icon: Search, href: "/search" },
    { label: "POST", icon: PlusCircle, href: "/post" },
    { label: "MY RIDES", icon: Car, href: "/dashboard" },
    { label: "STATUS", icon: Info, href: "/status" },
    { label: "RATING", icon: Star, href: "/rating" },
    { label: "LOGOUT", icon: LogOut, href: "#logout", isLogout: true },
  ];

  return (
    <nav className="h-[64px] min-h-[64px] bg-white border-t border-gray-100 flex items-center justify-around z-50 sticky bottom-0 left-0 right-0 px-2 shadow-sm">
      {tabs.map((tab) => {
        const isCurrentActive = activeTab
          ? activeTab === tab.label
          : pathname === tab.href;

        const Icon = tab.icon;

        if (tab.isLogout) {
          return (
            <motion.a
              key={tab.label}
              href="#logout"
              onClick={handleLogout}
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer"
            >
              <LogOut size={20} className="text-brand" />
              <span className="text-[9px] font-bold tracking-tight text-brand mt-0.5">
                LOGOUT
              </span>
            </motion.a>
          );
        }

        return (
          <Link key={tab.label} href={tab.href} className="flex-1 h-full">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center h-full relative select-none"
            >
              {isCurrentActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-1 rounded-full bg-brand absolute top-1"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={isCurrentActive ? "text-brand" : "text-gray-400"}
              />
              <span
                className={`text-[9px] font-bold tracking-tight mt-0.5 ${
                  isCurrentActive ? "text-brand" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
