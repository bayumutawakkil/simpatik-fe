import { useState, type ReactNode } from "react";
import type { Page, Role } from "../../models/app";
import { Icon } from "../shared";

const adminMenu = [
  { page: "dashboard" as Page, label: "Dashboard", icon: "grid" },
  { page: "students" as Page, label: "Siswa", icon: "users", group: "DATA MASTER" },
  { page: "teachers" as Page, label: "Guru dan Akun", icon: "teacher" },
  { page: "classes" as Page, label: "Kelas", icon: "class" },
  { page: "subjects" as Page, label: "Mata Pelajaran", icon: "book" },
  { page: "assignments" as Page, label: "Penugasan Guru", icon: "link" },
  { page: "achievements" as Page, label: "Prestasi", icon: "award", group: "AKADEMIK" },
  { page: "monitoring" as Page, label: "Monitoring Siswa", icon: "chart" },
  { page: "reports" as Page, label: "Laporan", icon: "file" },
  { page: "security" as Page, label: "Akun dan Keamanan", icon: "shield", group: "PENGATURAN" },
  { page: "help" as Page, label: "Bantuan", icon: "help" },
];
const guruMenu = [
  { page: "dashboard" as Page, label: "Dashboard", icon: "grid" },
  { page: "students" as Page, label: "Siswa Saya", icon: "users" },
  { page: "grades" as Page, label: "Penilaian", icon: "edit", group: "AKADEMIK" },
  { page: "attendance" as Page, label: "Kehadiran", icon: "calendar" },
  { page: "achievements" as Page, label: "Prestasi", icon: "award" },
  { page: "monitoring" as Page, label: "Monitoring Siswa", icon: "chart" },
  { page: "reports" as Page, label: "Laporan", icon: "file" },
  { page: "security" as Page, label: "Akun dan Keamanan", icon: "shield", group: "PENGATURAN" },
  { page: "help" as Page, label: "Bantuan", icon: "help" },
];
const kepsekMenu = [
  { page: "dashboard" as Page, label: "Dashboard", icon: "grid" },
  { page: "grades" as Page, label: "Nilai Akademik", icon: "chart", group: "MONITORING AKADEMIK" },
  { page: "monitoring" as Page, label: "Monitoring Siswa", icon: "chart" },
  { page: "achievements" as Page, label: "Prestasi", icon: "award" },
  { page: "reports" as Page, label: "Laporan", icon: "file" },
  { page: "security" as Page, label: "Akun dan Keamanan", icon: "shield", group: "PENGATURAN" },
  { page: "help" as Page, label: "Bantuan", icon: "help" },
];

export function AppShell({ role, page, go, children }: { role: Role; page: Page; go: (page: Page) => void; children: ReactNode }) {
  const [sidebar, setSidebar] = useState(false);
  const menu = role === "admin" ? adminMenu : role === "kepsek" ? kepsekMenu : guruMenu;
  const title = menu.find((item) => item.page === page)?.label || "Dashboard";
  let lastGroup = "";

  return <div className="app-shell">
    <aside className={`sidebar ${sidebar ? "open" : ""}`}>
      <div className="sidebar-brand"><div className="brand-logo">S</div><div><strong>SIMPATIK</strong><span>Yayasan Ishlahul Ummah</span></div><button className="sidebar-close" onClick={() => setSidebar(false)}>×</button></div>
      <div className="role-card"><div className="role-icon"><Icon name={role === "admin" ? "shield" : role === "kepsek" ? "shield" : "teacher"} /></div><div><span>Masuk sebagai</span><strong>{role === "admin" ? "Administrator" : role === "kepsek" ? "Kepala Sekolah" : "Guru"}</strong></div></div>
      <nav>{menu.map((item) => { const label = item.group && item.group !== lastGroup ? item.group : ""; if (item.group) lastGroup = item.group; return <div key={item.page}>{label && <div className="nav-group">{label}</div>}<button className={page === item.page ? "active" : ""} onClick={() => { go(item.page); setSidebar(false); }}><Icon name={item.icon} /><span>{item.label}</span>{page === item.page && <i />}</button></div>; })}</nav>
      <div className="sidebar-footer"><div className="foundation-mark">YIU</div><div><strong>Yayasan Ishlahul Ummah</strong><span>Kota Sawahlunto</span></div></div>
    </aside>
    {sidebar && <div className="mobile-overlay" onClick={() => setSidebar(false)} />}
    <div className="main-shell"><header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setSidebar(true)}><Icon name="menu" /></button><div className="breadcrumb"><span>SIMPATIK</span><Icon name="arrow" size={13} /><strong>{title}</strong></div></div><div className="topbar-right"><div className="period"><span>Tahun Ajaran / Semester</span><select><option>2024/2025 · Genap</option><option>2024/2025 · Ganjil</option></select></div><button className="notification"><Icon name="bell" /><i /></button><button className="user-menu" onClick={() => go("security")}><div className="avatar">{role === "admin" ? "RA" : role === "kepsek" ? "KS" : "AS"}</div><div><strong>{role === "admin" ? "Rahmi Ananda" : role === "kepsek" ? "Kepala Sekolah" : "Andi Saputra"}</strong><span>{role === "admin" ? "Administrator" : role === "kepsek" ? "Kepala Sekolah" : "Guru"}</span></div><span>⌄</span></button></div></header><main className="content">{children}</main></div>
  </div>;
}
