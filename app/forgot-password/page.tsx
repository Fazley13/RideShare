"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send reset link");
      }

      setSuccess(true);
      showToast("Reset link sent successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to send reset link", "error");
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
      <div className="scroll-container bg-white flex flex-col justify-between h-full">
        <div className="px-6 pt-6">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/login")}
              className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="bg-brand rounded-xl p-1.5">
                <Car size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-black text-brand tracking-tight">
                RideShare
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter your email to receive a password reset link.
          </p>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 border border-emerald-100 rounded-2xl bg-emerald-50/50 flex flex-col items-center text-center"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-sm font-bold text-emerald-800">Check your email for a reset link.</p>
              <p className="text-xs text-emerald-600 mt-1">If the email exists, we have sent instructions to reset your password.</p>
              <Link href="/login" className="rs-btn mt-6 no-underline">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Email Input
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="rs-input"
                  required
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={loading}
                  className="rs-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>

        <div className="px-6 pb-12 pt-6">
          <p className="text-center text-xs text-gray-500">
            Remember your credentials?{" "}
            <Link href="/login" className="text-brand font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
