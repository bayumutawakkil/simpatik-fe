import { useEffect, useMemo, useState } from "react";
import { canAccessPage, type Achievement, type Page, type Role, type Student, type Toast } from "../models/app";
import { AppShell } from "./layout/AppShell";
import { Login } from "./auth/LoginView";
import { Dashboard } from "./dashboard/DashboardView";
import { StudentsPage } from "./students/StudentsView";
import { MasterPage } from "./master/MasterView";
import { AttendancePage, GradesPage } from "./academic/AcademicViews";
import { AchievementsPage } from "./achievements/AchievementsView";
import { MonitoringPage } from "./monitoring/MonitoringView";
import { ReportsPage } from "./reports/ReportsView";
import { SecurityPage } from "./settings/SecurityView";
import { HelpPage } from "./help/HelpView";

export function AppView({ role, page, students, achievements, setStudents, setAchievements, go, onLogin, notify, logout }: {
  role: Role | null; page: Page; students: Student[]; achievements: Achievement[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  go: (page: Page) => void; onLogin: (role: Role) => void;
  notify: (message: string, type?: "success" | "error") => void; logout: () => void;
}) {
  const [toast, setToast] = useState<Toast>(null);
  const visiblePage = role && canAccessPage(role, page) ? page : "dashboard";
  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<NonNullable<Toast>>).detail;
      setToast(detail);
      window.setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("simpatik:toast", onToast);
    return () => window.removeEventListener("simpatik:toast", onToast);
  }, []);

  const content = useMemo(() => {
    if (!role) return null;
    switch (visiblePage) {
      case "dashboard": return <Dashboard role={role} students={students} achievements={achievements} go={go} />;
      case "students": return <StudentsPage role={role} students={students} setStudents={setStudents} notify={notify} />;
      case "teachers": case "classes": case "subjects": case "assignments": return <MasterPage type={visiblePage} notify={notify} readOnly={role === "kepsek"} />;
      case "grades": return <GradesPage students={students} setStudents={setStudents} notify={notify} readOnly={role === "kepsek"} />;
      case "attendance": return <AttendancePage students={students} setStudents={setStudents} notify={notify} />;
      case "achievements": return <AchievementsPage role={role} achievements={achievements} setAchievements={setAchievements} students={students} notify={notify} />;
      case "monitoring": return <MonitoringPage students={role === "guru" ? students.filter((student) => student.className !== "Kelas C") : students} />;
      case "reports": return <ReportsPage role={role} students={students} notify={notify} />;
      case "security": return <SecurityPage role={role} logout={logout} notify={notify} />;
      default: return <HelpPage />;
    }
  }, [achievements, go, logout, notify, role, setAchievements, setStudents, students, visiblePage]);

  if (!role) return <Login onLogin={onLogin} />;

  return <AppShell role={role} page={visiblePage} go={go}>{content}{toast && <div className={`toast ${toast.type}`}><span>{toast.message}</span><button onClick={() => setToast(null)}>×</button></div>}</AppShell>;
}
