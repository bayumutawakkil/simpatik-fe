const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { message?: string };
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, headers });
    const contentType = response.headers.get("content-type");
    let body: any;
    if (contentType && contentType.includes("application/json")) {
      body = await response.json();
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Server mengembalikan error (${response.status}): ${text || response.statusText}`);
      }
      return text as unknown as T;
    }

    if (!response.ok || !body.success) {
      throw new Error(body?.error?.message || "Permintaan ke server gagal");
    }
    return body.data;
  } catch (err: any) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Gagal terhubung ke server backend (port 4000). Pastikan backend sedang berjalan.");
    }
    throw err;
  }
}

export type ApiStudent = {
  id: string;
  nis: string;
  nama: string;
  kelas?: { id: string; nama: string } | null;
};

export type ApiAchievement = {
  id: string;
  judul: string;
  bidang: string;
  tingkat: string;
  peringkat?: string | null;
  tanggalPerolehan: string;
  statusVerifikasi: "PENDING" | "DIVERIFIKASI" | "DITOLAK";
  siswa?: { nama: string } | null;
};

export type ApiClass = {
  id: string;
  nama: string;
  tingkat: number;
  tahunAjaran: string;
};

export type ApiSubject = {
  id: string;
  kode: string;
  nama: string;
  kkm: number;
};

export type ApiMatrixReportItem = {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  kelasId?: string | null;
  nilaiMapel: Record<string, number>;
  rataRata: number;
  statusKetuntasan: string;
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await request<{ accessToken: string; user: { id: string; role: "ADMIN" | "GURU" | "KEPSEK"; name: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res?.accessToken) {
      localStorage.setItem("token", res.accessToken);
    }
    return res;
  },
  me: () => request<{ id: string; name: string; role: "ADMIN" | "GURU" | "KEPSEK"; email: string }>("/auth/me"),
  students: (search = "") =>
    request<ApiStudent[]>(`/siswa?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`),
  classes: () => request<ApiClass[]>("/kelas"),
  subjects: () => request<ApiSubject[]>("/mata-pelajaran"),
  createStudent: (data: Record<string, unknown>) =>
    request<ApiStudent>("/siswa", { method: "POST", body: JSON.stringify(data) }),
  updateStudent: (id: string, data: Record<string, unknown>) =>
    request<ApiStudent>(`/siswa/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStudent: (id: string) => request<null>(`/siswa/${id}`, { method: "DELETE" }),
  achievements: () => request<ApiAchievement[]>("/prestasi?limit=100"),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<null>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
  reportMatrix: (kelasId?: string, periode?: string) => {
    const params = new URLSearchParams({ mode: "matrix" });
    if (kelasId) params.set("kelasId", kelasId);
    if (periode) params.set("periode", periode);
    return request<ApiMatrixReportItem[]>(`/laporan/nilai?${params.toString()}`);
  },
  downloadReportPdf: async (siswaId: string, periode?: string) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/laporan/pdf/rapor/${siswaId}${periode ? `?periode=${encodeURIComponent(periode)}` : ""}`;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new Error("Gagal mengunduh rapor PDF dari server.");
    }
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `Rapor-Resmi-${siswaId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  },
  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
