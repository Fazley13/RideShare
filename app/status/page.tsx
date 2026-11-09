"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPin,
  Navigation,
  Play,
  Square,
  MessageSquare,
  Bell,
  X,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

// Dynamic import for Leaflet map component (SSR bypass)
const RideMap = dynamic(() => import("@/components/RideMap"), { ssr: false });

export default function StatusPage() {
  const router = useRouter();
  const { user, token } = useAuth(true);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [rideId, setRideId] = useState<string | null>(null);
  const [rideStatus, setRideStatus] = useState("pending"); // pending, active, completed

  const [pickup, setPickup] = useState("Student Commons");
  const [destination, setDestination] = useState("Engineering Block B");

  // Dhaka coordinates for simulation
  const [startCoords, setStartCoords] = useState<[number, number]>([23.8103, 90.4125]);
  const [endCoords, setEndCoords] = useState<[number, number]>([23.8158, 90.4220]);
  const [currentPos, setCurrentPos] = useState<[number, number]>([23.8103, 90.4125]);

  // Movement simulation timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Chat modal state
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState<Record<string, string[]>>({
    "Alex Thompson": ["Hi, on my way to Student Commons!", "Awesome, see you there."],
    "Sarah Chen": ["Hey, did you start yet?", "Just starting in a moment."],
  });

  useEffect(() => {
    if (!token) return;

    async function getActiveRide() {
      try {
        const data = await fetchClient("/api/rides/my-rides");
        const driving = data.driving || [];
        const booked = data.booked || [];
        const allRides = [...driving, ...booked];

        // Try to find any active or pending ride
        const activeOrPending =
          allRides.find((r: any) => r.status === "active" || r.status === "pending") ||
          allRides[0]; // fallback to latest ride if none is active/pending

        if (activeOrPending) {
          setRideId(activeOrPending._id);
          setRideStatus(activeOrPending.status);
          setPickup(activeOrPending.origin?.address || activeOrPending.origin || "");
          setDestination(activeOrPending.destination?.address || activeOrPending.destination || "");

          // Get coordinates or default to Dhaka values
          const fromLat = activeOrPending.origin?.coordinates?.latitude || 23.8103;
          const fromLng = activeOrPending.origin?.coordinates?.longitude || 90.4125;
          const toLat = activeOrPending.destination?.coordinates?.latitude || 23.8158;
          const toLng = activeOrPending.destination?.coordinates?.longitude || 90.4220;

          setStartCoords([fromLat, fromLng]);
          setEndCoords([toLat, toLng]);
          setCurrentPos([fromLat, fromLng]);
        }
      } catch (err) {
        console.error("Failed to load active ride", err);
      } finally {
        setLoading(false);
      }
    }

    getActiveRide();
  }, [token]);

  // Simulate movement when status is "active"
  useEffect(() => {
    if (rideStatus === "active") {
      let stepIndex = 0;
      const totalSteps = 60;

      timerRef.current = setInterval(() => {
        stepIndex++;
        if (stepIndex <= totalSteps) {
          const ratio = stepIndex / totalSteps;
          const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * ratio;
          const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * ratio;
          setCurrentPos([lat, lng]);
        } else {
          // Completed path simulation
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 3000); // update position every 3 seconds
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rideStatus, startCoords, endCoords]);

  const handleStartRide = async () => {
    setRideStatus("active");
    showToast("Ride is now active! Live tracking started.", "success");

    if (rideId) {
      try {
        await fetchClient("/api/rides", {
          method: "PUT",
          body: JSON.stringify({ rideId, status: "active" }),
        });
      } catch (err) {
        console.error("Failed to update status in DB", err);
      }
    }
  };

  const handleEndRide = async () => {
    setRideStatus("completed");
    showToast("Ride completed! Redirecting to feedback page...", "success");

    if (rideId) {
      try {
        await fetchClient("/api/rides", {
          method: "PUT",
          body: JSON.stringify({ rideId, status: "completed" }),
        });
      } catch (err) {
        console.error("Failed to update status in DB", err);
      }
    }

    setTimeout(() => {
      // Pass ride status info to rating
      router.push(`/rating?rideId=${rideId || "mock-ride-123"}`);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatUser || !chatMessage.trim()) return;

    const userMessages = chats[chatUser] || [];
    setChats({
      ...chats,
      [chatUser]: [...userMessages, chatMessage.trim()],
    });
    setChatMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mobile-shell"
    >
      <Header title="Ride Status" showNotification />

      <div className="scroll-container bg-[#F5F4F0] flex flex-col justify-between">
        <div className="flex-1 space-y-4 px-4 py-4">
          {/* Route Card */}
          <div className="rs-card p-4 bg-white space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand mt-1 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Pickup</p>
                <p className="text-xs font-bold text-gray-800 truncate">{pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Destination</p>
                <p className="text-xs font-bold text-gray-800 truncate">{destination}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleStartRide}
              disabled={rideStatus === "active"}
              className="rs-btn-outline font-bold flex items-center justify-center gap-1.5 py-3 rounded-2xl min-h-0 text-xs border border-gray-200"
            >
              <Play size={14} className="fill-current" />
              START RIDE
            </button>
            <button
              onClick={handleEndRide}
              className="rs-btn font-bold flex items-center justify-center gap-1.5 py-3 rounded-2xl min-h-0 text-xs text-white"
            >
              <Square size={12} className="fill-current text-white" />
              END RIDE
            </button>
          </div>

          {/* Distance and Earnings Row */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-gray-100">
            <div className="text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Distance</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">3.8 km</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Earnings</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">$18.40</p>
            </div>
          </div>

          {/* Live Map Preview */}
          <div className="rs-card bg-gray-950 rounded-3xl h-[200px] overflow-hidden border-0 relative shadow-sm">
            <RideMap
              pickup={startCoords}
              destination={endCoords}
              currentPos={currentPos}
              polylinePoints={[startCoords, currentPos, endCoords]}
              zoom={14}
            />
          </div>

          {/* Navigation Overlay */}
          <div className="rs-card p-4 bg-gray-900 border-0 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-black text-sm text-white">
                A
              </div>
              <div>
                <p className="text-[9px] text-white/50 uppercase font-black tracking-wider">Next Turn</p>
                <p className="text-xs font-bold leading-tight mt-0.5">400m @ University Ave</p>
              </div>
            </div>
            <span className="text-xl font-black text-brand tracking-tight">8 MIN</span>
          </div>

          {/* Passengers Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Current Passengers
            </h3>
            {[
              { name: "Alex Thompson", dest: "Engineering Block B" },
              { name: "Sarah Chen", dest: "Library North" },
            ].map((p, idx) => (
              <div key={idx} className="rs-card p-3 bg-white flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{p.name}</p>
                    <p className="text-[9px] text-gray-400 font-medium">To {p.dest}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChatUser(p.name)}
                  className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <MessageSquare size={14} className="text-gray-500" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat modal overlay */}
      <AnimatePresence>
        {chatUser && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-50 transition-opacity"
              onClick={() => setChatUser(null)}
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
                    {chatUser[0]}
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{chatUser}</span>
                </div>
                <button
                  onClick={() => setChatUser(null)}
                  className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {(chats[chatUser] || []).map((msg, i) => {
                  const isUser = i % 2 === 1; // simulation
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

      <BottomNav activeTab="STATUS" />
    </motion.div>
  );
}
