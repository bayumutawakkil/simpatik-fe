import { useState } from "react";
import { AppView } from "../views/AppView";
import { useAcademicData } from "./academicController";
import { useNavigation } from "./navigationController";
import { useSession } from "./sessionController";

export default function AppController() {
  const notify = (message: string, type: "success" | "error" = "success") => {
    window.dispatchEvent(new CustomEvent("simpatik:toast", { detail: { message, type } }));
  };
  const { role, login, logout } = useSession();
  const { page, go } = useNavigation(role);
  const { students, achievements, setStudents, setAchievements } = useAcademicData(role, notify);

  return <AppView
    role={role}
    page={page}
    students={students}
    achievements={achievements}
    setStudents={setStudents}
    setAchievements={setAchievements}
    go={go}
    onLogin={(nextRole) => { login(nextRole); go("dashboard"); }}
    notify={notify}
    logout={() => {
      logout();
      go("dashboard");
    }}
  />;
}
