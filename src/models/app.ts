export type Role = "admin" | "guru" | "kepsek";
export type Page = "dashboard" | "students" | "teachers" | "classes" | "subjects" | "assignments" | "grades" | "attendance" | "achievements" | "monitoring" | "reports" | "security" | "help";
export type Student = { id: string; nis: string; name: string; className: string; classId?: string; status: string; current: number; previous: number; attendance: number; achievements: number };
export type Achievement = { id: number | string; student: string; name: string; field: string; level: string; date: string; result: string; status: "Menunggu Verifikasi" | "Perlu Revisi" | "Terverifikasi"; note?: string };
export type Toast = { type: "success" | "error"; message: string } | null;

export const pages: Page[] = ["dashboard", "students", "teachers", "classes", "subjects", "assignments", "grades", "attendance", "achievements", "monitoring", "reports", "security", "help"];

/** Mapping dari Page key ke URL path yang digunakan BrowserRouter */
export const pageToPath: Record<Page, string> = {
  dashboard:   "/dashboard",
  students:    "/students",
  teachers:    "/master/teachers",
  classes:     "/master/classes",
  subjects:    "/master/subjects",
  assignments: "/master/assignments",
  grades:      "/grades",
  attendance:  "/attendance",
  achievements:"/achievements",
  monitoring:  "/monitoring",
  reports:     "/reports",
  security:    "/security",
  help:        "/help",
};

/** Kebalikan: URL path → Page key */
export const pathToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToPath).map(([page, path]) => [path, page as Page])
) as Record<string, Page>;

export const rolePages: Record<Role, Page[]> = {
  admin: ["dashboard", "students", "teachers", "classes", "subjects", "assignments", "achievements", "monitoring", "reports", "security", "help"],
  guru: ["dashboard", "students", "grades", "attendance", "achievements", "monitoring", "reports", "security", "help"],
  kepsek: ["dashboard", "grades", "monitoring", "achievements", "reports", "security", "help"],
};

export function canAccessPage(role: Role, page: Page): boolean {
  return rolePages[role].includes(page);
}
