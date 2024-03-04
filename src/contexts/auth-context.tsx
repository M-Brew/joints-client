"use client";

import axios from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext<IAuthContext>({});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser>();

  const checkAuth = useCallback(async () => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setLoggedIn(false);
        router.push("/admin");
      } else {
        const payload = jwtDecode<IJWTPayload>(accessToken);
        if (payload?.exp && payload.exp < new Date().getTime() / 1000) {
          setLoggedIn(false);
          const response = await axios.post(
            "/api/auth/token",
            { token: refreshToken },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response?.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            setLoggedIn(true);
            setUser?.({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              role: payload.role,
            });
          }
        } else {
          setLoggedIn(true);
          setUser?.({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          });
          if (pathName === "/admin") {
            router.push("/admin/dashboard");
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoggedIn(false);
      setLoading(false);
    }
  }, [router, pathName]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
