export type Role = "admin" | "guru" | "kepsek";
export type Page = "dashboard" | "students" | "teachers" | "classes" | "subjects" | "assignments" | "grades" | "attendance" | "achievements" | "monitoring" | "reports" | "security" | "help";
export type Student = { id: string; nis: string; name: string; className: string; classId?: string; status: string; current: number; previous: number; attendance: number; achievements: number };
export type Achievement = { id: number | string; student: string; name: string; field: string; level: string; date: string; result: string; status: "Menunggu Verifikasi" | "Perlu Revisi" | "Terverifikasi"; note?: string };
export type Toast = { type: "success" | "error"; message: string } | null;

export const pages: Page[] = ["dashboard", "students", "teachers", "classes", "subjects", "assignments", "grades", "attendance", "achievements", "monitoring", "reports", "security", "help"];

export const rolePages: Record<Role, Page[]> = {
  admin: ["dashboard", "students", "teachers", "classes", "subjects", "assignments", "achievements", "monitoring", "reports", "security", "help"],
  guru: ["dashboard", "students", "grades", "attendance", "achievements", "monitoring", "reports", "security", "help"],
  kepsek: ["grades", "achievements", "reports"],
};

export function canAccessPage(role: Role, page: Page): boolean {
  return rolePages[role].includes(page);
}
