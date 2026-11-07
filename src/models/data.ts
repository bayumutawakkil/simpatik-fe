import type { ApiAchievement, ApiStudent } from "../api";
import type { Achievement, Student } from "./app";

export const studentsSeed: Student[] = [
  { id: "demo-1", nis: "2024001", name: "Aulia Rahma", className: "Kelas A", status: "Aktif", current: 88, previous: 84, attendance: 96, achievements: 1 },
  { id: "demo-2", nis: "2024002", name: "Fikri Ramadhan", className: "Kelas A", status: "Aktif", current: 72, previous: 81, attendance: 92, achievements: 0 },
  { id: "demo-3", nis: "2024003", name: "Nabila Putri", className: "Kelas A", status: "Aktif", current: 86, previous: 83, attendance: 76, achievements: 1 },
  { id: "demo-4", nis: "2024004", name: "Rizky Maulana", className: "Kelas B", status: "Aktif", current: 79, previous: 77, attendance: 88, achievements: 0 },
  { id: "demo-5", nis: "2024005", name: "Siti Khadijah", className: "Kelas B", status: "Aktif", current: 91, previous: 87, attendance: 100, achievements: 1 },
  { id: "demo-6", nis: "2024006", name: "Daffa Alfarizi", className: "Kelas C", status: "Aktif", current: 75, previous: 78, attendance: 72, achievements: 0 },
];

export const achievementsSeed: Achievement[] = [
  { id: "demo-1", student: "Aulia Rahma", name: "Juara 1 Tahfiz", field: "Keagamaan", level: "Kota", date: "12 Jan 2025", result: "Juara 1", status: "Terverifikasi" },
  { id: "demo-2", student: "Nabila Putri", name: "Olimpiade Matematika", field: "Akademik", level: "Provinsi", date: "18 Feb 2025", result: "Finalis", status: "Menunggu Verifikasi" },
  { id: "demo-3", student: "Siti Khadijah", name: "Lomba Pidato", field: "Bahasa", level: "Kota", date: "03 Mar 2025", result: "Juara 2", status: "Perlu Revisi", note: "Mohon unggah sertifikat yang terlihat utuh dan jelas." },
];

export function mapStudent(student: ApiStudent): Student {
  return { id: student.id, nis: student.nis, name: student.nama, className: student.kelas?.nama || "Belum ditempatkan", classId: student.kelas?.id, status: "Aktif", current: 0, previous: 0, attendance: 0, achievements: 0 };
}

export function mapAchievement(achievement: ApiAchievement): Achievement {
  const status = achievement.statusVerifikasi === "DIVERIFIKASI" ? "Terverifikasi" : achievement.statusVerifikasi === "DITOLAK" ? "Perlu Revisi" : "Menunggu Verifikasi";
  return { id: achievement.id, student: achievement.siswa?.nama || "Siswa", name: achievement.judul, field: achievement.bidang, level: achievement.tingkat, date: new Date(achievement.tanggalPerolehan).toLocaleDateString("id-ID"), result: achievement.peringkat || "-", status };
}
