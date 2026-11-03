import { useEffect, useState } from "react";
import { api } from "../api";
import type { Role } from "../models/app";

export function useSession() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.me().then((user) => setRole(user.role === "ADMIN" ? "admin" : user.role === "KEPSEK" ? "kepsek" : "guru")).catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });
    const onExpired = () => setRole(null);
    window.addEventListener("simpatik:session-expired", onExpired);
    return () => window.removeEventListener("simpatik:session-expired", onExpired);
  }, []);

  const login = (nextRole: Role) => setRole(nextRole);
  const logout = () => {
    const token = localStorage.getItem("token");
    if (token) void api.logout().catch(() => undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRole(null);
  };

  return { role, login, logout };
}
