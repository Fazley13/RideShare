"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Bell, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  showBack?: boolean;
  showClose?: boolean;
  title?: string;
  showNotification?: boolean;
}

export default function Header({
  showBack,
  showClose,
  title,
  showNotification,
}: HeaderProps) {
  const router = useRouter();
  const [initials, setInitials] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Ride Confirmed!",
      message: "Professor Marcus confirmed your booking for 8:30 AM.",
      time: "2m ago",
      unread: true,
    },
    {
      id: "2",
      title: "Driver Arrived",
      message: "Alex Thompson is waiting at Student Commons.",
      time: "15m ago",
      unread: true,
    },
    {
      id: "3",
      title: "New Match Found",
      message: "A new ride fits your search criteria from Gate A.",
      time: "1h ago",
      unread: false,
    },
  ]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("rideshare_token");
      const userStr = localStorage.getItem("rideshare_user");
      if (token && userStr) {
        setIsAuthed(true);
        const user = JSON.parse(userStr);
        const first = user.firstName ? user.firstName[0] : "";
        const last = user.lastName ? user.lastName[0] : "";
        setInitials((first + last).toUpperCase() || "U");
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <header className="h-[56px] min-h-[56px] border-b border-gray-100 bg-white px-4 flex items-center justify-between z-45 sticky top-0">
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
        )}

        {showClose && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/dashboard")}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </motion.button>
        )}

        {!showBack && !showClose && (
          <Link
            href={isAuthed ? "/dashboard" : "/"}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="bg-brand rounded-xl p-1.5">
              <Car size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black text-brand tracking-tight">
              RideShare
            </span>
          </Link>
        )}

        {title && (
          <span className="text-base font-bold text-gray-900 truncate max-w-[200px]">
            {title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showNotification && (
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="p-1.5 hover:bg-gray-50 rounded-full relative transition-colors focus:outline-none flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white animate-pulse-dot" />
              )}
            </button>
            <AnimatePresence>
              {showNotificationsMenu && (
                <>
                  {/* Backdrop for closing */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotificationsMenu(false)}
                  />
                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        Notifications
                      </span>
                      <button
                        onClick={() => {
                          setNotifications(
                            notifications.map((n) => ({ ...n, unread: false }))
                          );
                        }}
                        className="text-[9px] font-black text-brand uppercase tracking-wider hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifications(
                              notifications.map((item) =>
                                item.id === n.id ? { ...item, unread: false } : item
                              )
                            );
                          }}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col gap-0.5 ${
                            n.unread ? "bg-red-50/30" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold ${
                                n.unread ? "text-gray-950 font-black" : "text-gray-700"
                              }`}
                            >
                              {n.title}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">
                              {n.time}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                            {n.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {isAuthed ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/profile")}
            className="w-8 h-8 rounded-full bg-brand text-white font-bold text-xs flex items-center justify-center border-2 border-brand-light focus:outline-none"
          >
            {initials || "U"}
          </motion.button>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold text-brand hover:underline"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
