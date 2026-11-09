"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Car,
  MapPin,
  Users,
  Clock,
  Shield,
  Plus,
  Minus,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

// Dynamic import for Leaflet map component (SSR bypass)
const RideMap = dynamic(() => import("@/components/RideMap"), { ssr: false });

export default function PostRidePage() {
  const router = useRouter();
  const { user, token } = useAuth(true);
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Route, 2: Details, 3: Preview
  const [from, setFrom] = useState("University North Gate");
  const [to, setTo] = useState("Downtown Tech Hub");
  const [seats, setSeats] = useState(3);
  const [time, setTime] = useState("08:30");
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optimizingPath, setOptimizingPath] = useState(false);

  // Coordinate states for Leaflet polyline previews
  const [pickupCoords, setPickupCoords] = useState<[number, number]>([23.8103, 90.4125]);
  const [destCoords, setDestCoords] = useState<[number, number]>([23.8160, 90.4260]);

  useEffect(() => {
    if (from && to) {
      setOptimizingPath(true);
      const timer = setTimeout(() => {
        // Simulate minor route variations for Dhaka coords
        setPickupCoords([23.8103, 90.4125]);
        setDestCoords([23.8158, 90.4220]);
        setOptimizingPath(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [from, to]);

  const incrementSeats = () => {
    if (seats < 8) setSeats(seats + 1);
  };

  const decrementSeats = () => {
    if (seats > 1) setSeats(seats - 1);
  };

  const handlePost = async () => {
    if (!from || !to || !time) {
      showToast("Please fill in all details", "error");
      return;
    }

    setLoading(true);
    try {
      // Create a valid departureTime ISO string combining today and the time selected
      const todayStr = new Date().toISOString().split("T")[0];
      const departureTime = new Date(`${todayStr}T${time}:00`).toISOString();

      const payload = {
        origin: {
          address: from,
          latitude: pickupCoords[0],
          longitude: pickupCoords[1],
        },
        destination: {
          address: to,
          latitude: destCoords[0],
          longitude: destCoords[1],
        },
        departureTime,
        totalSeats: seats,
        pricePerSeat: 5.00, // Default seat price for campus carpool
        genderPolicy: femaleOnly ? "women_only" : "any",
      };

      await fetchClient("/api/rides", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast("Ride posted successfully!", "success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to post ride", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mobile-shell"
    >
      <Header />

      <div className="scroll-container bg-[#F5F4F0] flex flex-col justify-between">
        <div className="px-5 pt-6 pb-2 bg-white mb-2">
          <span className="text-[10px] font-black text-brand uppercase tracking-wider block mb-1">
            DRIVE THE CAMPUS
          </span>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Offer a New Ride.
          </h1>

          {/* Progress step indicators */}
          <div className="flex items-center gap-2 mt-4 pb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-1.5">
                <div
                  className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                    step >= s ? "bg-brand" : "bg-gray-150"
                  }`}
                  style={step < s ? { backgroundColor: "#E5E7EB" } : {}}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2 space-y-4 flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Route Card */}
                <div className="rs-card p-5 bg-white space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Route Information
                  </h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Starting point"
                        className="rs-input !pl-11"
                        required
                      />
                    </div>
                    <div className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Where are you going?"
                        className="rs-input !pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rs-btn"
                >
                  Continue →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Available Seats Counter */}
                <div className="rs-card p-5 bg-white space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Available Seats
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400 w-5 h-5" />
                      <span className="text-sm font-semibold text-gray-700">Passenger Seats</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={decrementSeats}
                        className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </motion.button>
                      <span className="text-2xl font-black text-gray-900 w-6 text-center">{seats}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={incrementSeats}
                        className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Departure Time */}
                <div className="rs-card p-5 bg-white space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Departure Time
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400 w-5 h-5" />
                      <span className="text-sm font-semibold text-gray-700">Schedule Time</span>
                    </div>
                    <div className="relative">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="rs-input font-bold text-gray-800 text-sm max-w-[130px] border border-gray-200 py-2 px-3 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Female Only Toggle */}
                <div className="rs-card p-5 bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-50 p-2 rounded-xl border border-red-100">
                        <Shield className="text-brand w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">Female Only Ride</h4>
                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                          Restricts ride visibility to verified female passengers only.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none mt-1">
                      <input
                        type="checkbox"
                        checked={femaleOnly}
                        onChange={(e) => setFemaleOnly(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rs-btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rs-btn flex-1"
                  >
                    Preview →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.99, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Map Preview Card */}
                <div className="rs-card bg-gray-900 rounded-3xl overflow-hidden shadow-lg border-0 h-[220px] relative">
                  <RideMap
                    pickup={pickupCoords}
                    destination={destCoords}
                    polylinePoints={[pickupCoords, destCoords]}
                  />

                  {optimizingPath && (
                    <div className="absolute top-4 left-4 z-10 bg-gray-900/90 text-white font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-gray-800 flex items-center gap-1.5 shadow-md">
                      <Loader2 className="animate-spin w-3 h-3 text-brand" />
                      OPTIMIZING PATH
                    </div>
                  )}
                </div>

                {/* Summary Info */}
                <div className="rs-card p-5 bg-white space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Ride Overview
                  </h3>
                  <div className="space-y-2 text-xs font-semibold text-gray-700">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Departure:</span>
                      <span className="text-gray-800">{from}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Destination:</span>
                      <span className="text-gray-800">{to}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Seats Offered:</span>
                      <span className="text-gray-800">{seats} Seats</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Departure Time:</span>
                      <span className="text-gray-800">{time} AM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Policy:</span>
                      <span className="text-gray-800">
                        {femaleOnly ? "Female Only" : "Co-Ed/Any"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setStep(2)}
                    className="rs-btn-outline flex-1"
                  >
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    disabled={loading}
                    onClick={handlePost}
                    className="rs-btn flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Posting...
                      </>
                    ) : (
                      "Post Ride"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  );
}
