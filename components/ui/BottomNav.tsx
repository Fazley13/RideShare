"use client";
import Link from "next/link";
import { Home, Search, PlusCircle, User, Clock } from "lucide-react";
import cn from "@/lib/utils/cn";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/rides/search", label: "Search", icon: Search },
    { href: "/rides/booking", label: "Bookings", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0EFEB] z-40">
      <div className="max-w-xl mx-auto px-3 pb-[env(safe-area-inset-bottom)] pt-2 flex items-center gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex-1 flex flex-col items-center py-2.5 gap-1 transition-transform",
                active ? "text-brand scale-105" : "text-ink-muted",
              )}
            >
              <Icon size={18} />
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  active ? "text-brand" : "text-ink-muted",
                )}
              >
                {t.label.toUpperCase()}
              </span>
              {active && (
                <span className="mt-1 w-1 h-1 rounded-full bg-brand animate-pulse-dot" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
