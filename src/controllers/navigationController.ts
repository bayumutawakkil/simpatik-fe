import { useEffect, useState } from "react";
import { canAccessPage, pages, type Page, type Role } from "../models/app";

function readPage(): Page {
  const value = window.location.hash.replace(/^#\/?/, "") as Page;
  return pages.includes(value) ? value : "dashboard";
}

export function useNavigation(role: Role | null) {
  const [page, setPage] = useState<Page>(readPage);
  const go = (nextPage: Page) => {
    window.location.hash = `/${nextPage}`;
    setPage(nextPage);
  };

  useEffect(() => {
    const onHashChange = () => setPage(readPage());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (role && !canAccessPage(role, page)) go("dashboard");
  }, [page, role]);

  return { page, go };
}
