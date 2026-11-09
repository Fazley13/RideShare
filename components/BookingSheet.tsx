"use client";

import { motion } from "framer-motion";
import { X, Calendar, MapPin, DollarSign, Users } from "lucide-react";

interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ride: {
    id: string;
    origin: string;
    destination: string;
    departureTime: string;
    pricePerSeat: number;
    availableSeats: number;
    driver: {
      name: string;
      rating: number;
    };
  } | null;
  loading: boolean;
}

export default function BookingSheet({
  isOpen,
  onClose,
  onConfirm,
  ride,
  loading,
}: BookingSheetProps) {
  if (!isOpen || !ride) return null;

  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = new Date(ride.departureTime).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-xl z-[60] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">Confirm Booking</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Driver Details */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center">
              {ride.driver.name ? ride.driver.name[0].toUpperCase() : "D"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ride.driver.name}</p>
              <p className="text-xs text-gray-400">Driver rating: ★ {ride.driver.rating.toFixed(1)}</p>
            </div>
          </div>

          {/* Route details */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p>
                <p className="text-sm font-semibold text-gray-800">{ride.origin}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destination</p>
                <p className="text-sm font-semibold text-gray-800">{ride.destination}</p>
              </div>
            </div>
          </div>

          {/* Time & Price metadata */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
              <Calendar className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] text-gray-400 uppercase font-bold">Departure</span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">{formattedTime}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
              <Users className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-[9px] text-gray-400 uppercase font-bold">Seats Left</span>
              <span className="text-xs font-semibold text-gray-800 mt-0.5">{ride.availableSeats}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center">
              <DollarSign className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-[9px] text-gray-400 uppercase font-bold">Seat Price</span>
              <span className="text-xs font-semibold text-emerald-600 mt-0.5">${ride.pricePerSeat.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="rs-btn"
            >
              {loading ? "Confirming Booking..." : "Confirm Booking →"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="rs-btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
