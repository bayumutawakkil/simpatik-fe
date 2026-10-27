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

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message || "Permintaan ke server gagal");
  }
  return body.data;
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

export const api = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: { role: "ADMIN" | "GURU"; name: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ id: string; name: string; role: "ADMIN" | "GURU"; email: string }>("/auth/me"),
  students: (search = "") =>
    request<ApiStudent[]>(`/siswa?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`),
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
};
