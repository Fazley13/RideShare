"use client";

import { useRouter } from "next/navigation";
import { Car, Shield, Users, MapPin, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const pageAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
} as const;

const gridContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageAnimation}
      className="mobile-shell"
    >
      {/* Scrollable Container */}
      <div className="scroll-container bg-white">
        {/* Navigation / Header Row */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-brand rounded-xl p-2 shadow-lg shadow-brand/20">
              <Car size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-brand tracking-tight">
              RideShare
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-gray-600 hover:text-brand px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Login
          </motion.button>
        </div>

        {/* Hero Section */}
        <div className="px-6 pt-8 pb-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-brand/5 border border-brand/10 text-brand text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            VERIFIED CAMPUS NETWORK
          </div>

          <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-[1.1] mb-4">
            Your Campus,
            <br />
            <span className="text-brand">Connected.</span>
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed max-w-[340px] mb-8">
            Join fellow students for safe, verified rides across campus and
            beyond. Split costs, reduce emissions, make friends.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/register")}
              className="rs-btn"
            >
              Get Started <ArrowRight size={16} className="ml-2" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/login")}
              className="rs-btn-outline"
            >
              I Already Have an Account
            </motion.button>
          </div>
        </div>

        {/* Features Divider */}
        <div className="h-2 bg-gray-50 border-y border-gray-100" />

        {/* Features Grid */}
        <div className="px-6 py-8">
          <h2 className="text-lg font-black text-gray-900 mb-5">
            Why Students Love RideShare
          </h2>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {[
              {
                icon: <Shield className="text-brand w-5 h-5" />,
                title: "Verified Only",
                desc: "University email & ID verification required",
              },
              {
                icon: <Users className="text-brand w-5 h-5" />,
                title: "Gender Safety",
                desc: "Women-only & same-gender ride options",
              },
              {
                icon: <MapPin className="text-brand w-5 h-5" />,
                title: "Smart Routes",
                desc: "Matched rides based on your schedule",
              },
              {
                icon: <Star className="text-brand w-5 h-5" />,
                title: "Rated Drivers",
                desc: "Community-vetted ratings & reviews",
              },
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                variants={cardItem}
                className="rs-card p-4 flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Social Proof Divider */}
        <div className="h-2 bg-gray-50 border-y border-gray-100" />

        {/* Social Proof & Testimonial */}
        <div className="px-6 py-8">
          <div className="rs-card p-5 bg-gradient-to-br from-brand/[0.02] to-brand/[0.06] border-brand/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2.5">
                {["A", "B", "J", "K"].map((char, idx) => {
                  const colors = [
                    "bg-red-500",
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-amber-500",
                  ];
                  return (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${colors[idx]} shadow-sm`}
                    >
                      <span className="text-white text-[10px] font-bold">
                        {char}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">500+ Students</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  active on campus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-gray-800 ml-1">4.9 Stars</span>
            </div>

            <p className="text-xs text-gray-600 italic leading-relaxed">
              &ldquo;Finally a carpool app that actually feels safe. Knowing
              everyone is verified makes all the difference.&rdquo;
            </p>
            <p className="text-[10px] font-semibold text-gray-400 mt-2">
              — Sarah K., 3rd Year
            </p>
          </div>
        </div>

        {/* Final CTA Area */}
        <div className="px-6 pb-12 pt-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/register")}
            className="rs-btn"
          >
            Join RideShare Today <ArrowRight size={16} className="ml-2" />
          </motion.button>
          <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">
            Free forever · No credit card needed
          </p>
        </div>
      </div>
    </motion.div>
  );
}
