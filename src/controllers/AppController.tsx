import { useNavigate } from "react-router-dom";
import { AppView } from "../views/AppView";
import { useAcademicData } from "./academicController";
import { useNavigation } from "./navigationController";
import { useSession } from "./sessionController";

export default function AppController() {
  const notify = (message: string, type: "success" | "error" = "success") => {
    window.dispatchEvent(new CustomEvent("simpatik:toast", { detail: { message, type } }));
  };

  const { role, isChecking, login, logout } = useSession();
  const { page, go } = useNavigation(role);
  const { students, achievements, setStudents, setAchievements } = useAcademicData(role, notify);
  const navigate = useNavigate();

  return (
    <AppView
      role={role}
      isChecking={isChecking}
      page={page}
      students={students}
      achievements={achievements}
      setStudents={setStudents}
      setAchievements={setAchievements}
      go={go}
      onLogin={(nextRole) => {
        login(nextRole);
        navigate("/dashboard", { replace: true });
      }}
      notify={notify}
      logout={() => {
        logout();
        navigate("/login", { replace: true });
      }}
    />
  );
}
