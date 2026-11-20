/**
 * WHITEBOX TESTS — Controllers & Custom Hooks
 *
 * Strategi mock:
 * - react-router-dom di-mock agar useNavigate/useLocation tidak butuh
 *   <BrowserRouter> wrapper di test environment.
 * - api di-mock agar tidak ada network call nyata.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useNavigation } from "../../src/controllers/navigationController";
import { useSession } from "../../src/controllers/sessionController";
import { api } from "../../src/api";

// ── Mock react-router-dom ──────────────────────────────────────────────────
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/dashboard", search: "", hash: "", state: null, key: "default" };

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// ── Mock API ───────────────────────────────────────────────────────────────
vi.mock("../../src/api", () => ({
  api: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}));

// ──────────────────────────────────────────────────────────────────────────

describe("Frontend Custom Hooks & Controllers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockLocation.pathname = "/dashboard";
    vi.mocked(api.me).mockResolvedValue({
      id: "u1",
      role: "ADMIN",
      name: "Admin",
      email: "admin@test.com",
    });
    vi.mocked(api.logout).mockResolvedValue(undefined as any);
  });

  // ── useNavigation ────────────────────────────────────────────────────────

  describe("useNavigation Hook", () => {
    it("menginisialisasi page='dashboard' ketika pathname adalah /dashboard", () => {
      mockLocation.pathname = "/dashboard";
      const { result } = renderHook(() => useNavigation("admin"));
      expect(result.current.page).toBe("dashboard");
    });

    it("menginisialisasi page='students' ketika pathname adalah /students", () => {
      mockLocation.pathname = "/students";
      const { result } = renderHook(() => useNavigation("admin"));
      expect(result.current.page).toBe("students");
    });

    it("menginisialisasi page='achievements' ketika pathname adalah /achievements", () => {
      mockLocation.pathname = "/achievements";
      const { result } = renderHook(() => useNavigation("admin"));
      expect(result.current.page).toBe("achievements");
    });

    it("fallback ke 'dashboard' untuk pathname yang tidak dikenal", () => {
      mockLocation.pathname = "/tidak-ada";
      const { result } = renderHook(() => useNavigation("admin"));
      expect(result.current.page).toBe("dashboard");
    });

    it("go('students') memanggil navigate dengan path /students", () => {
      mockLocation.pathname = "/dashboard";
      const { result } = renderHook(() => useNavigation("admin"));
      act(() => {
        result.current.go("students");
      });
      expect(mockNavigate).toHaveBeenCalledWith("/students");
    });

    it("go('reports') memanggil navigate dengan path /reports", () => {
      const { result } = renderHook(() => useNavigation("admin"));
      act(() => {
        result.current.go("reports");
      });
      expect(mockNavigate).toHaveBeenCalledWith("/reports");
    });

    it("go('teachers') memanggil navigate dengan path /master/teachers", () => {
      const { result } = renderHook(() => useNavigation("admin"));
      act(() => {
        result.current.go("teachers");
      });
      expect(mockNavigate).toHaveBeenCalledWith("/master/teachers");
    });

    it("redirect dengan replace jika role tidak punya akses ke halaman saat ini", async () => {
      // Guru tidak boleh ke /master/teachers
      mockLocation.pathname = "/master/teachers";
      const { result } = renderHook(() => useNavigation("guru"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
      });
    });

    it("tidak redirect jika role punya akses ke halaman saat ini", async () => {
      mockLocation.pathname = "/achievements";
      renderHook(() => useNavigation("guru"));

      // Beri waktu untuk useEffect jalan
      await act(async () => {});
      expect(mockNavigate).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ replace: true })
      );
    });
  });

  // ── useSession ───────────────────────────────────────────────────────────

  describe("useSession Hook", () => {
    it("role null dan isChecking=false saat tidak ada token di localStorage", async () => {
      const { result } = renderHook(() => useSession());
      await waitFor(() => {
        expect(result.current.isChecking).toBe(false);
      });
      expect(result.current.role).toBeNull();
    });

    it("isChecking=true saat ada token, lalu false setelah api.me selesai", async () => {
      localStorage.setItem("token", "valid-jwt");
      vi.mocked(api.me).mockResolvedValue({
        id: "u1",
        role: "ADMIN",
        name: "Admin",
        email: "admin@test.com",
      });

      const { result } = renderHook(() => useSession());
      // Sesaat setelah mount, isChecking harus true
      expect(result.current.isChecking).toBe(true);

      await waitFor(() => expect(result.current.isChecking).toBe(false));
      expect(result.current.role).toBe("admin");
    });

    it("memetakan role ADMIN -> 'admin' dari respons api.me", async () => {
      localStorage.setItem("token", "jwt-admin");
      vi.mocked(api.me).mockResolvedValue({
        id: "u1",
        role: "ADMIN",
        name: "Admin",
        email: "admin@test.com",
      });
      const { result } = renderHook(() => useSession());
      await waitFor(() => expect(result.current.isChecking).toBe(false));
      expect(result.current.role).toBe("admin");
    });

    it("memetakan role KEPSEK -> 'kepsek' dari respons api.me", async () => {
      localStorage.setItem("token", "jwt-kepsek");
      vi.mocked(api.me).mockResolvedValue({
        id: "u2",
        role: "KEPSEK",
        name: "Kepsek",
        email: "kepsek@test.com",
      });
      const { result } = renderHook(() => useSession());
      await waitFor(() => expect(result.current.isChecking).toBe(false));
      expect(result.current.role).toBe("kepsek");
    });

    it("memetakan role GURU -> 'guru' dari respons api.me", async () => {
      localStorage.setItem("token", "jwt-guru");
      vi.mocked(api.me).mockResolvedValue({
        id: "u3",
        role: "GURU",
        name: "Guru",
        email: "guru@test.com",
      });
      const { result } = renderHook(() => useSession());
      await waitFor(() => expect(result.current.isChecking).toBe(false));
      expect(result.current.role).toBe("guru");
    });

    it("hapus token dan set role null jika api.me throw error", async () => {
      localStorage.setItem("token", "expired-jwt");
      vi.mocked(api.me).mockRejectedValue(new Error("Unauthorized"));

      const { result } = renderHook(() => useSession());
      await waitFor(() => expect(result.current.isChecking).toBe(false));
      expect(result.current.role).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("login() mengupdate role tanpa network call", () => {
      const { result } = renderHook(() => useSession());
      act(() => {
        result.current.login("admin");
      });
      expect(result.current.role).toBe("admin");
    });

    it("logout() mereset role ke null dan menghapus localStorage", () => {
      localStorage.setItem("token", "some-token");
      localStorage.setItem("user", JSON.stringify({ name: "Admin" }));

      const { result } = renderHook(() => useSession());
      act(() => {
        result.current.login("admin");
      });
      expect(result.current.role).toBe("admin");

      act(() => {
        result.current.logout();
      });
      expect(result.current.role).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("event simpatik:session-expired mereset role ke null", async () => {
      localStorage.setItem("token", "jwt");
      vi.mocked(api.me).mockResolvedValue({
        id: "u1",
        role: "ADMIN",
        name: "Admin",
        email: "admin@test.com",
      });
      const { result } = renderHook(() => useSession());
      await waitFor(() => expect(result.current.role).toBe("admin"));

      act(() => {
        window.dispatchEvent(new Event("simpatik:session-expired"));
      });
      expect(result.current.role).toBeNull();
    });
  });
});
