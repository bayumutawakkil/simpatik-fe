import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../models/app";

/**
 * Membungkus rute-rute yang memerlukan autentikasi.
 * Jika `role` null (belum login / token tidak valid), redirect ke /login.
 * `isChecking` mencegah redirect prematur saat token sedang divalidasi ke server.
 */
export function ProtectedRoute({
  role,
  isChecking,
}: {
  role: Role | null;
  isChecking: boolean;
}) {
  if (isChecking) {
    // Tampilkan layar kosong selama validasi token berlangsung,
    // sehingga tidak ada flash redirect yang tidak perlu.
    return null;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
