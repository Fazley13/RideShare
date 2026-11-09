"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Car, Shield, Bolt, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form State
  const [universityId, setUniversityId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  // Field errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length < 8) {
      newErrors.phone = "Invalid phone number";
    }

    if (!gender) newErrors.gender = "Gender selection is required";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agree) {
      newErrors.agree = "You must agree to the guidelines";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please fix the validation errors", "error");
      return;
    }

    setLoading(true);
    try {
      // Map frontend values to register API schema
      const payload = {
        email,
        password,
        firstName,
        lastName,
        phone,
        gender: gender === "Male" ? "male" : gender === "Female" ? "female" : "other",
        studentId: universityId || undefined,
        role: "passenger", // default role
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("rideshare_token", data.token);
      localStorage.setItem("rideshare_user", JSON.stringify(data.user));

      showToast("Account created successfully!", "success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mobile-shell"
    >
      <div className="scroll-container bg-white">
        {/* Header */}
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

        {/* Hero Title */}
        <div className="px-6 pt-4 pb-2 text-left">
          <div className="inline-flex items-center gap-1.5 bg-brand/5 border border-brand/10 text-brand text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            VERIFIED CAMPUS NETWORK
          </div>

          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            The New <span className="text-brand">Standard</span> in Campus Travel.
          </h1>
        </div>

        {/* Feature cards row */}
        <div className="px-6 py-2 grid grid-cols-2 gap-3">
          <div className="border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5 bg-gray-50/50">
            <div className="bg-white p-1.5 rounded-lg border border-gray-100">
              <Shield size={16} className="text-brand" />
            </div>
            <span className="text-[11px] font-bold text-gray-700">Staff & Student ID</span>
          </div>
          <div className="border border-gray-100 p-3 rounded-2xl flex items-center gap-2.5 bg-gray-50/50">
            <div className="bg-white p-1.5 rounded-lg border border-gray-100">
              <Bolt size={16} className="text-brand" />
            </div>
            <span className="text-[11px] font-bold text-gray-700">Smart Routing</span>
          </div>
        </div>

        {/* University image banner */}
        <div className="px-6 py-3">
          <div className="w-full h-32 relative rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/hero-bg.png"
              alt="Campus placeholder"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Form Container */}
        <div className="px-6 py-4">
          <h2 className="text-base font-black text-gray-900 mb-4 uppercase tracking-wider">
            Create Account
          </h2>

          <form onSubmit={handleRegister}>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {/* University ID */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  University ID (Optional)
                </label>
                <input
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  placeholder="STU-123456"
                  className="rs-input"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Email*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@neurolink.com"
                  className={`rs-input ${errors.email ? "border-brand" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs text-brand font-semibold">{errors.email}</p>
                )}
              </motion.div>

              {/* First Name & Last Name */}
              <motion.div variants={itemVariant} className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    className={`rs-input ${errors.firstName ? "border-brand" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-brand font-semibold">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Jenkins"
                    className={`rs-input ${errors.lastName ? "border-brand" : ""}`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-brand font-semibold">{errors.lastName}</p>
                  )}
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Phone*
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  className={`rs-input ${errors.phone ? "border-brand" : ""}`}
                />
                {errors.phone && (
                  <p className="text-xs text-brand font-semibold">{errors.phone}</p>
                )}
              </motion.div>

              {/* Gender */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Gender*
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`rs-input bg-white appearance-none ${errors.gender ? "border-brand" : ""}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-brand font-semibold">{errors.gender}</p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`rs-input !pr-11 ${errors.password ? "border-brand" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-brand font-semibold">{errors.password}</p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`rs-input !pr-11 ${errors.confirmPassword ? "border-brand" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-brand font-semibold">{errors.confirmPassword}</p>
                )}
              </motion.div>

              {/* Terms Checkbox */}
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 accent-brand rounded border-gray-300 focus:ring-brand"
                  />
                  <span className="text-[11px] text-gray-500 leading-snug">
                    I agree to the RideShare Campus Guidelines and Safety Protocol.
                  </span>
                </label>
                {errors.agree && (
                  <p className="text-xs text-brand font-semibold">{errors.agree}</p>
                )}
              </motion.div>

              {/* Submit CTA */}
              <motion.div variants={itemVariant} className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={loading}
                  className="rs-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 pb-8">
            Already a member?{" "}
            <Link href="/login" className="text-brand font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
