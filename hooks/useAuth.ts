"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: "female" | "male" | "other";
  role: "driver" | "passenger" | "admin";
  verifiedEmail: boolean;
  verifiedStudentId: boolean;
  rating?: number;
  rideCount?: number;
}

export function useAuth(requireUser: boolean = true) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function checkAuth() {
      try {
        const storedToken = localStorage.getItem("rideshare_token");
        const storedUser = localStorage.getItem("rideshare_user");

        if (!storedToken || !storedUser) {
          setToken(null);
          setUser(null);
          if (requireUser && pathname !== "/" && pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
            router.push("/login");
          }
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("rideshare_token");
        localStorage.removeItem("rideshare_user");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router, pathname, requireUser]);

  const logout = () => {
    localStorage.removeItem("rideshare_token");
    localStorage.removeItem("rideshare_user");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  return { user, token, isLoading, logout };
}
