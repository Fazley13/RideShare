"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      localStorage.setItem("rideshare_token", data.token);
      localStorage.setItem("rideshare_user", JSON.stringify(data.user));

      showToast("Signed in successfully!", "success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
      showToast(err.message || "Invalid credentials", "error");
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
        <div className="px-6 pt-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-brand rounded-xl p-2 shadow-lg shadow-brand/20">
              <Car size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-brand tracking-tight">
              RideShare
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-8">
            The New <span className="text-brand">Standard</span> in Campus Travel.
          </h1>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-brand text-xs font-semibold rounded-2xl">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@neurolink.com"
                className="rs-input"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rs-input !pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="rs-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Signing In...
                  </>
                ) : (
                  "Sign In →"
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="px-6 pb-12 pt-6">
          <p className="text-center text-xs text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand font-bold">
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
