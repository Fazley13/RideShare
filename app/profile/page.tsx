"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Car,
  Camera,
  Pencil,
  Shield,
  Star,
  Activity,
  Navigation,
  CheckCircle,
  Users,
  Compass,
  Mail,
  BookOpen,
  Music,
  Plus,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  const router = useRouter();
  const { token } = useAuth(true);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);

  // Editable fields state
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [universityEmail, setUniversityEmail] = useState("hero@university.edu");
  const [majorAndYear, setMajorAndYear] = useState("Computer Science, 4th Year");
  const [preferredMusic, setPreferredMusic] = useState("Lo-Fi / Synthwave");
  const [bio, setBio] = useState("Eco-conscious commuter. Driving daily to campus libraries.");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  // Photo uploading simulation
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function getProfile() {
      try {
        const data = await fetchClient("/api/profile");
        setProfile(data.user);
        if (data.user?.preferences?.musicPreference) {
          setPreferredMusic(data.user.preferences.musicPreference);
        }
        if (data.user?.universityEmail) {
          setUniversityEmail(data.user.universityEmail);
        }
        setBio(data.user?.preferences?.bio || "Eco-conscious commuter. Driving daily to campus libraries.");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [token]);

  const handleEditClick = (fieldName: string, currentValue: string) => {
    setEditField(fieldName);
    setEditValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditField(null);
    setEditValue("");
  };

  const handleSaveField = async (fieldName: string) => {
    try {
      let payload: any = {};
      if (fieldName === "PREFERRED MUSIC") {
        setPreferredMusic(editValue);
        payload = {
          preferences: {
            musicPreference: editValue,
          },
        };
      } else if (fieldName === "UNIVERSITY EMAIL") {
        setUniversityEmail(editValue);
        // Simulate email update if not supported in backend directly
      } else if (fieldName === "MAJOR & YEAR") {
        setMajorAndYear(editValue);
      }

      if (Object.keys(payload).length > 0) {
        await fetchClient("/api/profile", {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      showToast(`${fieldName} updated successfully!`, "success");
      setEditField(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save updates", "error");
    }
  };

  const handleSaveBio = async () => {
    try {
      setBio(newBio);
      setIsEditingBio(false);
      
      // Update locally or via mock
      showToast("Bio updated successfully!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        showToast("Profile photo uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || !profile) {
    return (
      <div className="mobile-shell bg-white p-6 flex flex-col justify-center items-center h-screen">
        <Loader2 className="animate-spin text-brand w-10 h-10 mb-3" />
        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Syncing profile data...
        </span>
      </div>
    );
  }

  const name = `${profile.firstName} ${profile.lastName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mobile-shell"
    >
      <Header />

      <div className="scroll-container bg-[#F5F4F0] flex flex-col">
        {/* Hero Banner Header Card */}
        <section className="bg-white pb-6 border-b border-gray-150">
          <div className="h-32 w-full bg-gradient-to-r from-red-500 to-rose-700 relative">
            {/* Photo upload trigger */}
            <div className="absolute -bottom-10 left-6">
              <label className="relative block cursor-pointer select-none">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-brand text-white text-2xl font-black flex items-center justify-center overflow-hidden shadow-md">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Uploaded Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile.firstName ? profile.firstName[0].toUpperCase() : "U"
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-gray-900 border border-white text-white p-1 rounded-full shadow-md">
                  <Camera size={12} />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-12 px-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 leading-tight">{name}</h2>
                <span className="bg-red-50 text-brand px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Verified Student
                </span>
              </div>

              {/* Bio editable inline */}
              <div className="pt-1">
                {isEditingBio ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-1 text-xs font-semibold w-full bg-gray-50 focus:border-brand outline-none"
                    />
                    <button
                      onClick={handleSaveBio}
                      className="bg-brand text-white font-bold text-[10px] px-3 rounded-lg hover:bg-brand-dark transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="border border-gray-200 text-gray-500 font-bold text-[10px] px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p
                    onClick={() => {
                      setNewBio(bio);
                      setIsEditingBio(true);
                    }}
                    className="text-xs text-gray-500 leading-relaxed max-w-[280px] cursor-pointer hover:text-gray-700 transition-colors select-none italic"
                  >
                    {bio}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-2">
                <div className="flex items-center text-amber-500 gap-0.5 text-xs font-black">
                  <Star className="fill-amber-500 w-3.5 h-3.5" />
                  <span>★ {profile.rating?.toFixed(1) || "4.8"}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  (124 Reviews)
                </span>
              </div>
            </div>

            {/* Edit Profile FAB */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNewBio(bio);
                setIsEditingBio(true);
              }}
              className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/20 hover:bg-brand-hover transition-colors"
            >
              <Pencil size={16} />
            </motion.button>
          </div>
        </section>

        {/* Stats Grid (2x2) */}
        <section className="px-4 py-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: "RIDES GIVEN", val: "42", icon: <Car size={18} />, active: false },
              { label: "KM SHARED", val: "1.2k", icon: <Navigation size={18} />, active: false },
              { label: "CO2 SAVED", val: "150kg", icon: <Activity size={18} />, active: true },
              { label: "CONNECTIONS", val: "88", icon: <Users size={18} />, active: false },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariant}
                className={`rs-card p-4 flex flex-col justify-between h-20 ${
                  stat.active
                    ? "bg-brand text-white border-brand shadow-md shadow-brand/10"
                    : "bg-white text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black tracking-wider ${stat.active ? "text-white/80" : "text-gray-400"}`}>
                    {stat.label}
                  </span>
                  <div className={stat.active ? "text-white" : "text-brand"}>{stat.icon}</div>
                </div>
                <span className="text-xl font-black leading-none">{stat.val}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Switch to Admin Dashboard for Admin Users */}
        {profile.role === "admin" && (
          <section className="px-4 pb-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/admin")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={14} className="text-brand" />
              Switch to Admin Dashboard
            </motion.button>
          </section>
        )}

        {/* Personal Information card */}
        <section className="px-4 pb-4">
          <div className="rs-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Personal Information
            </h3>

            {/* University Email */}
            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                  UNIVERSITY EMAIL
                </span>
                {editField === "UNIVERSITY EMAIL" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-0.5 text-xs font-bold bg-gray-50 focus:border-brand outline-none mt-1 w-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800 truncate block mt-0.5">
                    {universityEmail}
                  </span>
                )}
              </div>

              <div className="ml-4">
                {editField === "UNIVERSITY EMAIL" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveField("UNIVERSITY EMAIL")}
                      className="text-xs font-bold text-brand"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="text-xs font-bold text-gray-400">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("UNIVERSITY EMAIL", universityEmail)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Major and Year */}
            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                  MAJOR & YEAR
                </span>
                {editField === "MAJOR & YEAR" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-0.5 text-xs font-bold bg-gray-50 focus:border-brand outline-none mt-1 w-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800 truncate block mt-0.5">
                    {majorAndYear}
                  </span>
                )}
              </div>

              <div className="ml-4">
                {editField === "MAJOR & YEAR" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveField("MAJOR & YEAR")}
                      className="text-xs font-bold text-brand"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="text-xs font-bold text-gray-400">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("MAJOR & YEAR", majorAndYear)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Preferred Music */}
            <div className="flex justify-between items-center py-1.5">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                  PREFERRED MUSIC
                </span>
                {editField === "PREFERRED MUSIC" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-0.5 text-xs font-bold bg-gray-50 focus:border-brand outline-none mt-1 w-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800 truncate block mt-0.5">
                    {preferredMusic}
                  </span>
                )}
              </div>

              <div className="ml-4">
                {editField === "PREFERRED MUSIC" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveField("PREFERRED MUSIC")}
                      className="text-xs font-bold text-brand"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="text-xs font-bold text-gray-400">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("PREFERRED MUSIC", preferredMusic)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Details card */}
        <section className="px-4 pb-12">
          <div className="rs-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Vehicle Details
              </h3>
              <span className="bg-red-50 text-brand px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                Primary Car
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
                <Image
                  src="/hero-bg.png"
                  alt="Car preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-gray-800">Tesla Model 3</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Midnight Silver • 2022
                </p>
                <div className="inline-block bg-gray-100 border border-gray-200 text-gray-700 text-[9px] font-black px-2 py-0.5 rounded mt-2 uppercase tracking-widest">
                  VELOCITY-24
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </motion.div>
  );
}
