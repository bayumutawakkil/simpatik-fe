import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  canAccessPage,
  rolePages,
  type Achievement,
  type Page,
  type Role,
  type Student,
  type Toast,
} from "../models/app";
import { ProtectedRoute } from "../components/ProtectedRoute";
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

export function AppView({
  role,
  isChecking,
  page,
  students,
  achievements,
  setStudents,
  setAchievements,
  go,
  onLogin,
  notify,
  logout,
}: {
  role: Role | null;
  isChecking: boolean;
  page: Page;
  students: Student[];
  achievements: Achievement[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  go: (page: Page) => void;
  onLogin: (role: Role) => void;
  notify: (message: string, type?: "success" | "error") => void;
  logout: () => void;
}) {
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<NonNullable<Toast>>).detail;
      setToast(detail);
      window.setTimeout(() => setToast(null), 3000);
    };
    window.addEventListener("simpatik:toast", onToast);
    return () => window.removeEventListener("simpatik:toast", onToast);
  }, []);

  // Konten halaman yang dibungkus AppShell, dipakai semua rute terproteksi
  const shellContent = (child: React.ReactNode) => {
    if (!role) return null;
    const visiblePage = canAccessPage(role, page) ? page : rolePages[role][0];
    return (
      <AppShell role={role} page={visiblePage} go={go}>
        {child}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}
      </AppShell>
    );
  };

  return (
    <Routes>
      {/* Halaman login — publik */}
      <Route path="/login" element={<Login onLogin={onLogin} />} />

      {/* Semua rute terproteksi */}
      <Route element={<ProtectedRoute role={role} isChecking={isChecking} />}>
        <Route
          path="/dashboard"
          element={shellContent(
            <Dashboard role={role!} students={students} achievements={achievements} go={go} />
          )}
        />
        <Route
          path="/students"
          element={shellContent(
            <StudentsPage role={role!} students={students} setStudents={setStudents} notify={notify} />
          )}
        />
        <Route
          path="/master/teachers"
          element={shellContent(<MasterPage type="teachers" notify={notify} readOnly={role === "kepsek"} />)}
        />
        <Route
          path="/master/classes"
          element={shellContent(<MasterPage type="classes" notify={notify} readOnly={role === "kepsek"} />)}
        />
        <Route
          path="/master/subjects"
          element={shellContent(<MasterPage type="subjects" notify={notify} readOnly={role === "kepsek"} />)}
        />
        <Route
          path="/master/assignments"
          element={shellContent(<MasterPage type="assignments" notify={notify} readOnly={role === "kepsek"} />)}
        />
        <Route
          path="/grades"
          element={shellContent(
            <GradesPage
              students={students}
              setStudents={setStudents}
              notify={notify}
              readOnly={role === "kepsek"}
            />
          )}
        />
        <Route
          path="/attendance"
          element={shellContent(
            <AttendancePage
              students={students}
              setStudents={setStudents}
              notify={notify}
              readOnly={role === "kepsek"}
            />
          )}
        />
        <Route
          path="/achievements"
          element={shellContent(
            <AchievementsPage
              role={role!}
              achievements={achievements}
              setAchievements={setAchievements}
              students={students}
              notify={notify}
            />
          )}
        />
        <Route
          path="/monitoring"
          element={shellContent(
            <MonitoringPage
              students={role === "guru" ? students.filter((s) => s.className !== "Kelas C") : students}
            />
          )}
        />
        <Route
          path="/reports"
          element={shellContent(
            <ReportsPage role={role!} students={students} achievements={achievements} notify={notify} />
          )}
        />
        <Route
          path="/security"
          element={shellContent(<SecurityPage role={role!} logout={logout} notify={notify} />)}
        />
        <Route path="/help" element={shellContent(<HelpPage />)} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Fallback 404 — redirect ke dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
