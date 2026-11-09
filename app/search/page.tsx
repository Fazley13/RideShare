"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Navigation,
  Shield,
  Search,
  Star,
  Users,
  Car as CarIcon,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import BookingSheet from "@/components/BookingSheet";
import SkeletonCard from "@/components/SkeletonCard";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function SearchPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [femaleOnly, setFemaleOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Booking Sheet state
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !destination) {
      showToast("Please enter departure and destination locations", "error");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const payload = {
        origin: departure,
        destination: destination,
        filters: {
          priceRange: [0, 100],
          driverRating: 0,
          luggageSpace: false,
        },
        safety: {
          genderPolicy: femaleOnly ? "women_only" : "any",
        },
      };

      const data = await fetchClient("/api/rides/search", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setResults(data.results || []);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to search rides", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (ride: any) => {
    setSelectedRide(ride);
  };

  const handleConfirmBooking = async () => {
    if (!selectedRide) return;

    setBookingLoading(true);
    try {
      const payload = {
        rideId: selectedRide.id,
        passengerCount: 1,
        agreedToTerms: true,
      };

      await fetchClient("/api/rides/book", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast("Ride booked successfully!", "success");
      setSelectedRide(null);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Booking failed", "error");
    } finally {
      setBookingLoading(false);
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

      <div className="scroll-container bg-[#F5F4F0] flex flex-col">
        {/* Title */}
        <section className="px-5 pt-6 pb-4 bg-white mb-2">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Find Your <span className="text-brand">Velocity.</span>
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
            Safe, community-driven academic transit.
          </p>
        </section>

        {/* Search Form Card */}
        <section className="px-4 py-3 bg-white mb-2">
          <form onSubmit={handleSearch} className="space-y-3">
            {/* Departure */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand w-4 h-4" />
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Campus Gate A"
                className="rs-input !pl-11"
                required
              />
            </div>

            {/* Destination */}
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Science Park"
                className="rs-input !pl-11"
                required
              />
            </div>

            {/* Safety Filter Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-150 rounded-2xl bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Shield className="text-brand w-4 h-4" />
                <span className="text-xs font-bold text-gray-700">Female Only Ride</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={femaleOnly}
                  onChange={(e) => setFemaleOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
              </label>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="rs-btn flex items-center justify-center gap-2"
            >
              <Search size={16} />
              {loading ? "Searching..." : "Search Rides"}
            </motion.button>
          </form>
        </section>

        {/* Results Section */}
        <section className="px-4 py-4 flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <SkeletonCard />
                <SkeletonCard />
              </motion.div>
            ) : hasSearched && results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center justify-center p-8 bg-white border border-gray-100 rounded-3xl min-h-[220px]"
              >
                <div className="w-14 h-14 bg-red-50 text-brand rounded-full flex items-center justify-center mb-4">
                  <Search size={26} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">No rides found.</h3>
                <p className="text-[11px] text-gray-500 mt-1 max-w-[220px]">
                  Try widening your search locations or turning off the female-only policy toggle.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {results.map((ride, index) => {
                  // Alternate styles A, B, C for demonstration
                  const styleVariant = index % 3;

                  // Style A Card
                  if (styleVariant === 0) {
                    return (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rs-card p-4 bg-white relative space-y-3"
                      >
                        {ride.safety.genderPolicy === "women_only" && (
                          <span className="absolute top-4 right-4 bg-brand text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            FEMALE ONLY
                          </span>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center">
                            {ride.driver.name ? ride.driver.name[0].toUpperCase() : "E"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-gray-800 text-sm">{ride.driver.name}</span>
                              <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold ml-1">
                                <Star className="fill-amber-500 w-3 h-3" />
                                <span>{ride.driver.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Verified Student
                            </span>
                          </div>
                        </div>

                        {/* Locations */}
                        <div className="text-xs text-gray-600 pl-1 space-y-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                            <span className="font-semibold text-gray-700 truncate">{ride.origin}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span className="font-semibold text-gray-700 truncate">{ride.destination}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                          <div>
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
                              SEAT PRICE
                            </span>
                            <span className="text-base font-black text-gray-900">
                              ${ride.pricePerSeat.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Users size={12} />
                              {ride.availableSeats} Left
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              onClick={() => handleBook(ride)}
                              className="rs-btn py-2 px-4 min-h-0 text-xs rounded-xl"
                            >
                              Book
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Style B Card
                  if (styleVariant === 1) {
                    return (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rs-card p-4 bg-white relative space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs">
                              {ride.driver.name ? ride.driver.name[0].toUpperCase() : "S"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{ride.driver.name}</p>
                              <p className="text-[9px] text-gray-400 italic font-medium leading-none mt-0.5">
                                &ldquo;Driving to Science Block A...&rdquo;
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-brand">${ride.pricePerSeat.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1.5">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Starts in 15 mins
                          </span>
                          {ride.safety.genderPolicy === "women_only" && (
                            <span className="bg-red-50 text-brand text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Female Only Ride
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                          <span className="text-[10px] text-gray-500 font-semibold truncate max-w-[200px]">
                            {ride.origin.split(",")[0]} → {ride.destination.split(",")[0]}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleBook(ride)}
                            className="bg-brand text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm hover:bg-brand-dark transition-colors"
                          >
                            Book Now
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  }

                  // Style C Card (Compact)
                  return (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rs-card p-3.5 bg-white flex gap-3.5"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-xl relative flex-shrink-0 overflow-hidden">
                        <Image
                          src="/hero-bg.png"
                          alt="Route banner"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="text-xs font-black text-gray-900 truncate">
                              {ride.origin.split(",")[0]} Loop
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium truncate">
                              Scheduled transit to {ride.destination.split(",")[0]}
                            </p>
                          </div>
                          <span className="text-xs font-black text-gray-800">${ride.pricePerSeat.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="bg-red-50 text-brand text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            FEMALE PREFERRED
                          </span>
                          <button
                            onClick={() => handleBook(ride)}
                            className="text-[10px] font-black text-brand flex items-center gap-0.5 hover:underline focus:outline-none"
                          >
                            Details <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* CTA Card driving tomorrow - always rendered at the bottom */}
        <section className="px-4 pb-6 mt-auto">
          <div className="rs-card p-5 bg-brand text-white flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-black uppercase tracking-wider">Driving Tomorrow?</h3>
              <p className="text-xs text-white/80 leading-relaxed mt-1">
                Offer seats to fellow campus members, split driving costs, and reduce local campus emission.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/post")}
              className="w-full bg-white text-brand font-bold text-xs uppercase tracking-wider py-3 rounded-2xl hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              Post a Ride <ArrowRight size={14} />
            </motion.button>
          </div>
        </section>
      </div>

      {/* Booking confirmation bottom sheet */}
      <AnimatePresence>
        {selectedRide && (
          <BookingSheet
            isOpen={!!selectedRide}
            onClose={() => setSelectedRide(null)}
            onConfirm={handleConfirmBooking}
            ride={selectedRide}
            loading={bookingLoading}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
}
