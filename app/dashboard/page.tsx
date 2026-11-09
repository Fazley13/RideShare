"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Search,
  Plus,
  History,
  BarChart2,
  MessageSquare,
  Calendar,
  Send,
  X,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth(true);
  const { showToast } = useToast();

  const [loadingRides, setLoadingRides] = useState(true);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any | null>(null);

  // Chat modal state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Hey! Are you still at the Library?",
    "Yes, wrapping up in 5 mins. I will wait by the gate.",
  ]);

  useEffect(() => {
    if (!token) return;

    async function getMyRides() {
      try {
        const data = await fetchClient("/api/rides/my-rides");
        // Flatten or list the driving + booked upcoming rides
        const driving = data.driving || [];
        const booked = data.booked || [];

        const allRides = [...driving, ...booked];
        // Sort by departureTime
        allRides.sort(
          (a: any, b: any) =>
            new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        );

        // Find if there is an active ride (status === 'active')
        const active = allRides.find((r: any) => r.status === "active");
        setActiveRide(active || null);

        // Filter out the active one for other upcoming rides
        const upcoming = allRides.filter((r: any) => r._id !== active?._id);
        setUpcomingRides(upcoming);
      } catch (err: any) {
        console.error(err);
        showToast(err.message || "Failed to load rides", "error");
      } finally {
        setLoadingRides(false);
      }
    }

    getMyRides();
  }, [token, showToast]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, chatMessage.trim()]);
    setChatMessage("");
  };

  if (isLoading) {
    return (
      <div className="mobile-shell bg-white p-6 flex flex-col justify-center items-center h-screen">
        <LoaderSpinner />
      </div>
    );
  }

  const firstName = user?.firstName || "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mobile-shell"
    >
      <Header showNotification />

      <div className="scroll-container bg-[#F5F4F0] flex flex-col">
        {/* Welcome greeting */}
        <section className="px-5 pt-6 pb-4 bg-white mb-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
            Welcome back, {firstName}
          </p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Your Academic <br />
            <span className="text-brand">Journey Today.</span>
          </h1>
        </section>

        {/* Switch to Admin Dashboard for Admin Users */}
        {user?.role === "admin" && (
          <section className="px-4 py-2 bg-white mb-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/admin")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={14} className="text-brand" strokeWidth={2.5} />
              Switch to Admin Console
            </motion.button>
          </section>
        )}

        {/* Quick Actions grid (2x2) */}
        <section className="px-4 py-4 bg-white mb-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Offer Ride */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/post")}
              className="bg-brand hover:bg-brand-dark p-5 rounded-2xl cursor-pointer text-white flex flex-col justify-between h-28 shadow-sm transition-colors"
            >
              <Plus size={24} className="text-white" strokeWidth={2.5} />
              <span className="text-[11px] font-black tracking-widest uppercase">
                OFFER RIDE
              </span>
            </motion.div>

            {/* Find Ride */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/search")}
              className="bg-gray-150 hover:bg-gray-200 p-5 rounded-2xl cursor-pointer text-gray-800 flex flex-col justify-between h-28 shadow-sm transition-colors"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              <Search size={22} className="text-gray-600" />
              <span className="text-[11px] font-black tracking-widest uppercase text-gray-600">
                FIND RIDE
              </span>
            </motion.div>

            {/* History */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/dashboard")} // Routing to self as history/dashboard context
              className="bg-gray-150 hover:bg-gray-200 p-5 rounded-2xl cursor-pointer text-gray-800 flex flex-col justify-between h-28 shadow-sm transition-colors"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              <History size={22} className="text-gray-600" />
              <span className="text-[11px] font-black tracking-widest uppercase text-gray-600">
                HISTORY
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/profile")} // Route stats to profile / vehicle details
              className="p-5 rounded-2xl cursor-pointer text-white flex flex-col justify-between h-28 shadow-sm"
              style={{ backgroundColor: "#F28B6E" }} // salmon/orange
            >
              <BarChart2 size={22} className="text-white" />
              <span className="text-[11px] font-black tracking-widest uppercase text-white">
                STATS
              </span>
            </motion.div>
          </div>
        </section>

        {/* Pro Tip card */}
        <section className="mx-4 my-2">
          <div className="rs-card p-4 bg-white flex items-start gap-3 border border-gray-100">
            <span className="inline-block text-[9px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
              PRO TIP
            </span>
            <p className="text-xs font-semibold text-gray-600 leading-snug">
              Students who carpool 3× a week save up to $45 in weekly parking fees and reduce CO2 emissions!
            </p>
          </div>
        </section>

        {/* My Upcoming Rides section */}
        <section className="px-4 py-2 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">
              My Upcoming Rides
            </h2>
            <Link href="/dashboard" className="text-xs font-bold text-brand hover:underline">
              View All
            </Link>
          </div>

          {loadingRides ? (
            <SkeletonCard type="dashboard" />
          ) : !activeRide && upcomingRides.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center text-center justify-center p-8 bg-white border border-gray-100 rounded-3xl min-h-[200px]">
              <div className="w-14 h-14 bg-red-50 text-brand rounded-full flex items-center justify-center mb-4">
                <Car size={26} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">No upcoming rides.</h3>
              <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">
                Find a match or post your offer to connect with other campus members.
              </p>
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => router.push("/search")}
                  className="rs-btn-outline px-4 py-2 min-h-0 text-xs rounded-xl"
                >
                  Find Ride
                </button>
                <button
                  onClick={() => router.push("/post")}
                  className="rs-btn px-4 py-2 min-h-0 text-xs rounded-xl"
                >
                  Post Ride
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Ride Card */}
              {activeRide && (
                <div className="rs-card p-4 border-l-4 border-brand bg-white relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-brand/10 text-brand rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        ACTIVE NOW
                      </div>
                      <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                        {(activeRide.origin?.address || activeRide.origin || "").split(",")[0]} Route
                      </span>
                    </div>
                    <span className="text-lg font-black text-gray-900">
                      {new Date(activeRide.departureTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Pickup and Destination */}
                  <div className="text-xs text-gray-600 pl-1 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand" />
                      <span className="font-semibold text-gray-800 truncate">
                        {activeRide.origin?.address || activeRide.origin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="font-semibold text-gray-800 truncate">
                        {activeRide.destination?.address || activeRide.destination}
                      </span>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                    <span>EN ROUTE</span>
                    <span>2.4 KM REMAINING</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="h-full bg-brand rounded-full"
                    />
                  </div>

                  {/* Driver and message button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                        {activeRide.driverName ? activeRide.driverName[0].toUpperCase() : "M"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {activeRide.driverName || "Marcus Chen"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Verified Graduate Student
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setIsChatOpen(true)}
                      className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 text-[10px] font-black rounded-lg text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                    >
                      <MessageSquare size={12} />
                      MESSAGE
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Confirmed Upcoming Rides */}
              {upcomingRides.map((ride: any) => {
                const depDate = new Date(ride.departureTime);
                const isTomorrow =
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString() ===
                  depDate.toDateString();
                const dateString = isTomorrow
                  ? `Tomorrow, ${depDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : depDate.toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                return (
                  <div key={ride._id} className="rs-card p-4 bg-white relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{dateString}</span>
                      </div>
                      <span className="text-[9px] font-black text-brand bg-brand/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-0.5">
                          From
                        </p>
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {ride.origin?.address || ride.origin}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-0.5">
                          To
                        </p>
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {ride.destination?.address || ride.destination}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2">
                        {["J", "M"].map((p, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-red-100 text-brand font-bold border-2 border-white flex items-center justify-center text-[10px]"
                          >
                            {p}
                          </div>
                        ))}
                        <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[9px] font-black text-gray-500">
                          +{ride.totalSeats - ride.availableSeats || 1}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">
                        {ride.totalSeats - ride.availableSeats + 1 || 3} Passengers Total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Chat modal overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-50 transition-opacity"
              onClick={() => setIsChatOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-xl z-[60] overflow-hidden flex flex-col h-[50vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center text-xs">
                    M
                  </div>
                  <span className="font-bold text-gray-800 text-sm">Marcus Chen</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chatMessages.map((msg, i) => {
                  const isUser = i % 2 === 1; // simulation of conversation
                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-brand text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        {msg}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input field */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-gray-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="rs-input py-2 flex-1"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="p-2 bg-brand text-white rounded-xl shadow-md focus:outline-none"
                >
                  <Send size={16} />
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 border-4 border-brand-light border-t-brand rounded-full animate-spin" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
        Syncing Credentials...
      </span>
    </div>
  );
}
