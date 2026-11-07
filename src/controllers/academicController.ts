import { useEffect, useState } from "react";
import { api } from "../api";
import { achievementsSeed, mapAchievement, mapStudent, studentsSeed } from "../models/data";
import type { Achievement, Role, Student } from "../models/app";

export function useAcademicData(role: Role | null, notify: (message: string, type?: "success" | "error") => void) {
  const [students, setStudents] = useState<Student[]>(studentsSeed);
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsSeed);

  useEffect(() => {
    if (!role) return;
    Promise.all([api.students(), api.achievements()])
      .then(([remoteStudents, remoteAchievements]) => {
        setStudents(remoteStudents.map(mapStudent));
        setAchievements(remoteAchievements.map(mapAchievement));
      })
      .catch((error) => notify(error instanceof Error ? error.message : "Gagal memuat data dari server", "error"));
  }, [role]);

  return { students, achievements, setStudents, setAchievements };
}
