"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Shield,
  Users,
  BarChart2,
  Trash2,
  Search,
  Filter,
  Calendar,
  MapPin,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  User,
  Loader2,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Navigation,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth(true);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "rides">("overview");
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentRides, setRecentRides] = useState<any[]>([]);

  // User Directory States
  const [userList, setUserList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userPagination, setUserPagination] = useState<any>({ page: 1, limit: 10, total: 0, pages: 1 });
  const [usersLoading, setUsersLoading] = useState(false);

  // Ride Directory States
  const [rideList, setRideList] = useState<any[]>([]);
  const [rideStatusFilter, setRideStatusFilter] = useState("");
  const [ridePagination, setRidePagination] = useState<any>({ page: 1, limit: 10, total: 0, pages: 1 });
  const [ridesLoading, setRidesLoading] = useState(false);

  // Security check: redirect non-admins
  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      showToast("Access Denied: Admin permissions required.", "error");
      router.push("/dashboard");
    }
  }, [user, authLoading, router, showToast]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const data = await fetchClient("/api/admin");
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentRides(data.recentRides || []);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load admin statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadUserDirectory = async (page = 1) => {
    setUsersLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (userSearch) queryParams.append("search", userSearch);
      if (userRoleFilter) queryParams.append("role", userRoleFilter);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "10");

      const data = await fetchClient(`/api/admin/users?${queryParams.toString()}`);
      setUserList(data.users || []);
      setUserPagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load users list", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadRideDirectory = async (page = 1) => {
    setRidesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (rideStatusFilter) queryParams.append("status", rideStatusFilter);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "10");

      const data = await fetchClient(`/api/admin/rides?${queryParams.toString()}`);
      setRideList(data.rides || []);
      setRidePagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to load rides list", "error");
    } finally {
      setRidesLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      loadDashboardStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  useEffect(() => {
    if (token && user?.role === "admin") {
      if (activeTab === "users") {
        loadUserDirectory(1);
      } else if (activeTab === "rides") {
        loadRideDirectory(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userSearch, userRoleFilter, rideStatusFilter]);

  // Actions for User Management
  const handleUpdateUserStatus = async (userId: string, updates: any) => {
    try {
      await fetchClient(`/api/admin/users?userId=${userId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      showToast("User updated successfully!", "success");
      
      // Reload lists
      if (activeTab === "users") loadUserDirectory(userPagination.page);
      else loadDashboardStats();
    } catch (err: any) {
      showToast(err.message || "Failed to update user", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user permanently? This action is irreversible.")) return;
    try {
      await fetchClient(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      showToast("User deleted permanently", "success");
      
      if (activeTab === "users") loadUserDirectory(userPagination.page);
      else loadDashboardStats();
    } catch (err: any) {
      showToast(err.message || "Failed to delete user", "error");
    }
  };

  // Actions for Ride Management
  const handleUpdateRideStatus = async (rideId: string, status: string) => {
    try {
      await fetchClient(`/api/admin/rides?rideId=${rideId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      showToast("Ride updated successfully!", "success");
      
      if (activeTab === "rides") loadRideDirectory(ridePagination.page);
      else loadDashboardStats();
    } catch (err: any) {
      showToast(err.message || "Failed to update ride status", "error");
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    if (!confirm("Are you sure you want to delete this ride permanently?")) return;
    try {
      await fetchClient(`/api/admin/rides?rideId=${rideId}`, {
        method: "DELETE",
      });
      showToast("Ride deleted successfully", "success");
      
      if (activeTab === "rides") loadRideDirectory(ridePagination.page);
      else loadDashboardStats();
    } catch (err: any) {
      showToast(err.message || "Failed to delete ride", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rideshare_token");
    localStorage.removeItem("rideshare_user");
    showToast("Signed out successfully", "success");
    router.push("/admin/login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-brand w-12 h-12 mb-3" />
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Syncing Control Panel...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mobile-shell"
    >
      {/* Header */}
      <header className="h-[56px] min-h-[56px] border-b border-gray-100 bg-white px-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-brand rounded-xl p-1.5 shadow-md shadow-brand/10">
            <Car size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-black text-brand tracking-tight">
            Console
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === "overview") loadDashboardStats();
              else if (activeTab === "users") loadUserDirectory(1);
              else if (activeTab === "rides") loadRideDirectory(1);
              showToast("Data refreshed", "success");
            }}
            className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors focus:outline-none flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Scrollable Container */}
      <div className="scroll-container bg-[#F5F4F0] flex flex-col">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-5 space-y-5 flex-1"
          >
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Velocity System Admin</p>
              <h1 className="text-xl font-black text-gray-900 leading-tight">Dashboard Overview</h1>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Users", value: stats.totalUsers, desc: `${stats.drivers} Drivers`, color: "border-brand", icon: <Users className="text-brand w-4 h-4" /> },
                { label: "Total Rides", value: stats.totalRides, desc: `${stats.activeRides} Active`, color: "border-emerald-500", icon: <Car className="text-emerald-500 w-4 h-4" /> },
                { label: "Bookings", value: stats.totalBookings, desc: "Shared rides", color: "border-blue-500", icon: <ShieldCheck className="text-blue-500 w-4 h-4" /> },
                { label: "Reviews", value: stats.totalReviews, desc: "Community ratings", color: "border-amber-500", icon: <CheckCircle className="text-amber-500 w-4 h-4" /> },
              ].map((m, idx) => (
                <div key={idx} className={`bg-white border-l-4 ${m.color} p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.label}</span>
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-xl font-black text-gray-900 block leading-none">{m.value}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">{m.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Users Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Recent Accounts</h3>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-50 max-h-60 overflow-y-auto">
                {recentUsers.map((u) => (
                  <div key={u._id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-xs">
                        {u.firstName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 leading-snug truncate">{u.firstName} {u.lastName}</p>
                        <p className="text-[9px] text-gray-400 font-medium truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase tracking-wider ${
                        u.role === "admin" ? "bg-red-50 text-brand" : u.role === "driver" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Postings Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Recent Postings</h3>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-50 max-h-60 overflow-y-auto">
                {recentRides.map((r) => (
                  <div key={r._id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate leading-snug">
                        {r.origin?.address?.split(",")[0] || r.origin} → {r.destination?.address?.split(",")[0] || r.destination}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        By {r.driverName}
                      </p>
                    </div>
                    <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase tracking-wider flex-shrink-0 ${
                      r.status === "active" ? "bg-emerald-50 text-emerald-700" : r.status === "completed" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Users List */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-5 space-y-4 flex-1"
          >
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Control Panel</p>
              <h1 className="text-xl font-black text-gray-900 leading-tight">User Directory</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user..."
                  className="rs-input !pl-9 py-1.5 text-xs rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="rs-input py-1.5 px-3 text-xs rounded-xl bg-white flex-1"
                >
                  <option value="">All Roles</option>
                  <option value="driver">Drivers</option>
                  <option value="passenger">Passengers</option>
                  <option value="admin">Admins</option>
                </select>
                <button
                  onClick={() => loadUserDirectory(1)}
                  className="bg-brand text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-xl hover:bg-brand-hover shadow-sm transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Mobile Cards List */}
            {usersLoading ? (
              <div className="py-10 flex flex-col justify-center items-center">
                <Loader2 className="animate-spin text-brand w-8 h-8 mb-2" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Syncing users list...</span>
              </div>
            ) : userList.length === 0 ? (
              <div className="py-10 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <Users className="mx-auto text-gray-300 w-10 h-10 mb-2" />
                <p className="text-xs font-bold">No users matched your criteria.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userList.map((u) => (
                  <div key={u._id} className="rs-card p-4 bg-white space-y-3 relative">
                    {/* User main info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-sm shadow-inner">
                          {u.firstName[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 leading-snug">{u.firstName} {u.lastName}</h4>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider ${
                        u.role === "admin" ? "bg-red-50 text-brand" : u.role === "driver" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role}
                      </span>
                    </div>

                    {/* Verification Controls */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                      <div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block mb-1">Email Verification</span>
                        <button
                          onClick={() => handleUpdateUserStatus(u._id, { verifiedEmail: !u.verifiedEmail })}
                          className={`w-full py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                            u.verifiedEmail
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                              : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}
                        >
                          {u.verifiedEmail ? "Verified" : "Pending"}
                        </button>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block mb-1">Student ID Card</span>
                        <button
                          onClick={() => handleUpdateUserStatus(u._id, { verifiedStudentId: !u.verifiedStudentId })}
                          className={`w-full py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                            u.verifiedStudentId
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                              : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}
                        >
                          {u.verifiedStudentId ? "Verified" : "Pending"}
                        </button>
                      </div>
                    </div>

                    {/* Account Status Select & Delete Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Status:</span>
                        <select
                          value={u.status || "active"}
                          onChange={(e) => handleUpdateUserStatus(u._id, { status: e.target.value })}
                          className="bg-gray-50 border border-gray-200 text-[10px] font-bold rounded-lg px-2 py-1 outline-none text-gray-800"
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-gray-400 hover:text-brand bg-red-50/20 hover:bg-red-50 rounded-xl transition-colors border border-gray-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {userPagination.pages > 1 && (
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mt-4">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  Page {userPagination.page} of {userPagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={userPagination.page <= 1}
                    onClick={() => loadUserDirectory(userPagination.page - 1)}
                    className="px-2.5 py-1 rounded border border-gray-200 text-[10px] font-bold text-gray-600 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={userPagination.page >= userPagination.pages}
                    onClick={() => loadUserDirectory(userPagination.page + 1)}
                    className="px-2.5 py-1 rounded border border-gray-200 text-[10px] font-bold text-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Ride Registry */}
        {activeTab === "rides" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-5 space-y-4 flex-1"
          >
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Control Panel</p>
              <h1 className="text-xl font-black text-gray-900 leading-tight">Ride Registry</h1>
            </div>

            {/* Filter */}
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-2 items-center">
              <span className="text-xs font-bold text-gray-500">Status:</span>
              <select
                value={rideStatusFilter}
                onChange={(e) => setRideStatusFilter(e.target.value)}
                className="rs-input py-1.5 px-3 text-xs rounded-xl bg-white flex-1"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Registry Cards */}
            {ridesLoading ? (
              <div className="py-10 flex flex-col justify-center items-center">
                <Loader2 className="animate-spin text-brand w-8 h-8 mb-2" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Syncing itineraries...</span>
              </div>
            ) : rideList.length === 0 ? (
              <div className="py-10 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <Car className="mx-auto text-gray-300 w-10 h-10 mb-2" />
                <p className="text-xs font-bold">No rides registered under this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rideList.map((r) => (
                  <div key={r._id} className="rs-card p-4 bg-white space-y-3 relative">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Driver</span>
                        <h4 className="text-xs font-black text-gray-800">{r.driverName}</h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider ${
                        r.status === "active" ? "bg-emerald-50 text-emerald-700" : r.status === "completed" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    {/* Visual Path Locations */}
                    <div className="text-[11px] text-gray-600 pl-1 space-y-1.5 py-1 border-y border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-semibold text-gray-700 truncate">{r.origin?.address || r.origin}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <span className="font-semibold text-gray-700 truncate">{r.destination?.address || r.destination}</span>
                      </div>
                    </div>

                    {/* Stats info */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold pt-1">
                      <span>Seats: {r.availableSeats} / {r.totalSeats} Free</span>
                      <span>
                        {new Date(r.departureTime).toLocaleDateString([], { month: "short", day: "numeric" })} @ {new Date(r.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Status dropdown modify and Delete key */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Set Status:</span>
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRideStatus(r._id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-[10px] font-bold rounded-lg px-2 py-1 outline-none text-gray-800"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteRide(r._id)}
                        className="p-1.5 text-gray-400 hover:text-brand bg-red-50/20 hover:bg-red-50 rounded-xl transition-colors border border-gray-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {ridePagination.pages > 1 && (
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mt-4">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  Page {ridePagination.page} of {ridePagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={ridePagination.page <= 1}
                    onClick={() => loadRideDirectory(ridePagination.page - 1)}
                    className="px-2.5 py-1 rounded border border-gray-200 text-[10px] font-bold text-gray-600 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={ridePagination.page >= ridePagination.pages}
                    onClick={() => loadRideDirectory(ridePagination.page + 1)}
                    className="px-2.5 py-1 rounded border border-gray-200 text-[10px] font-bold text-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Admin Bottom Nav Bar */}
      <footer className="h-[64px] min-h-[64px] bg-white border-t border-gray-100 px-6 flex items-center justify-between z-40 sticky bottom-0">
        {[
          { id: "overview", label: "Overview", icon: <BarChart2 size={20} /> },
          { id: "users", label: "Users", icon: <Users size={20} /> },
          { id: "rides", label: "Rides", icon: <Car size={20} /> },
          { id: "user-mode", label: "User Mode", icon: <Home size={20} />, action: () => router.push("/dashboard") },
          { id: "logout", label: "Logout", icon: <LogOut size={20} />, action: handleLogout },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={tab.action ? tab.action : () => setActiveTab(tab.id as any)}
              className="flex flex-col items-center justify-center flex-1 h-full relative focus:outline-none select-none"
            >
              <div className={`transition-all duration-200 ${isActive ? "text-brand scale-110" : "text-gray-400 hover:text-gray-600"}`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] mt-1 font-bold uppercase tracking-wider transition-colors duration-200 ${
                isActive ? "text-brand font-black" : "text-gray-400"
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="adminActiveIndicator"
                  className="absolute bottom-1 w-1 h-1 bg-brand rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </footer>
    </motion.div>
  );
}
