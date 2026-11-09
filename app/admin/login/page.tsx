"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, Loader2, ShieldAlert, ShieldCheck, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"login" | "create">("login");
  const [loading, setLoading] = useState(false);

  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Setup Form States
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role !== "admin") {
        throw new Error("Access Denied: You do not have administrator permissions.");
      }

      localStorage.setItem("rideshare_token", data.token);
      localStorage.setItem("rideshare_user", JSON.stringify(data.user));

      showToast("Admin access granted! Redirecting...", "success");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cEmail || !cPassword || !firstName || !lastName || !phone) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setLoading(true);
    try {
      // 1. Register User
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cEmail,
          password: cPassword,
          firstName,
          lastName,
          phone,
          gender,
          role: "passenger",
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || "Failed to register account.");
      }

      // 2. Promote to Admin
      const promoteRes = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cEmail }),
      });

      const promoteData = await promoteRes.json();
      if (!promoteRes.ok) {
        throw new Error(promoteData.error || "Failed to promote account to admin.");
      }

      showToast("Admin account created and promoted! You can now log in.", "success");
      
      // Auto-fill login and swap tab
      setEmail(cEmail);
      setPassword(cPassword);
      setActiveTab("login");

      // Reset
      setCEmail("");
      setCPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
    } catch (err: any) {
      showToast(err.message || "Failed to setup admin account", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className="bg-brand rounded-2xl p-2.5 shadow-lg shadow-brand/20">
            <Car size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-brand tracking-tight">
            Velocity Admin
          </span>
        </div>
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          University Carpool System Control
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 rounded-3xl sm:px-10">
          
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <ShieldCheck size={14} />
              Admin Login
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === "create"
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserPlus size={14} />
              Setup Admin
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="bg-red-50/50 border border-red-100 p-3.5 rounded-2xl flex gap-2 text-[11px] leading-relaxed font-semibold text-brand mb-1">
                  <ShieldAlert className="flex-shrink-0 w-4 h-4 mt-0.5" />
                  <span>Authorized Personnel Only. All administrator interactions are logged and monitored.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rideshare.com"
                    className="rs-input"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Password
                  </label>
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
                        Verifying Admin credentials...
                      </>
                    ) : (
                      "Sign In as Admin"
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="create"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleCreateAdmin}
                className="space-y-3"
              >
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex gap-2 text-[11px] leading-relaxed font-semibold text-emerald-800 mb-1">
                  <ShieldCheck className="flex-shrink-0 w-4 h-4 mt-0.5 text-emerald-600" />
                  <span>Use this portal to register a new account and immediately promote it to the Admin role.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Admin"
                      className="rs-input"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Manager"
                      className="rs-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="admin@rideshare.com"
                    className="rs-input"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Setup Password (min 6 chars)
                  </label>
                  <input
                    type="password"
                    value={cPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rs-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1XXX-XXXXXX"
                      className="rs-input"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="rs-input bg-white appearance-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={loading}
                    className="rs-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        Provisioning Admin Profile...
                      </>
                    ) : (
                      "Register & Promote"
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          <Link href="/dashboard" className="font-bold text-brand hover:underline flex items-center justify-center gap-1.5">
            ← Return to Member Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
