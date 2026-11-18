import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { canAccessPage, pageToPath, pathToPage, rolePages, type Page, type Role } from "../models/app";

export function useNavigation(role: Role | null) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current Page key from the URL path, default to "dashboard"
  const page: Page = pathToPage[location.pathname] ?? "dashboard";

  const go = (nextPage: Page) => {
    navigate(pageToPath[nextPage]);
  };

  // If the current URL maps to a page the role can't access, redirect to first allowed page
  useEffect(() => {
    if (role && !canAccessPage(role, page)) {
      navigate(pageToPath[rolePages[role][0]], { replace: true });
    }
  }, [page, role, navigate]);

  return { page, go };
}
