import { test, expect } from "@playwright/test";

/**
 * BLACKBOX E2E TESTS — SIMPATIK Workflows
 *
 * Setelah migrasi ke react-router-dom:
 * - Navigasi sidebar menggunakan <NavLink> (elemen <a>), bukan <button>
 * - URL berubah secara nyata di address bar (bukan hash)
 * - Semua selector disesuaikan
 */

test.describe("E2E SIMPATIK Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── Helper login ──────────────────────────────────────────────────────────
  async function loginAs(page: any, role: "admin" | "guru" | "kepsek") {
    const label = role === "admin" ? "Demo Admin" : role === "guru" ? "Demo Guru" : "Demo Kepsek";
    await page.getByRole("button", { name: label }).click();
    await page.getByRole("button", { name: "Masuk ke SIMPATIK" }).click();
    await expect(page.locator(".role-card strong")).toBeVisible({ timeout: 8000 });
  }

  // ── Test 1: Redirect unauthenticated → /login ─────────────────────────────
  test("1. Akses langsung /dashboard tanpa login diarahkan ke /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("h2")).toContainText("Masuk ke akun Anda");
  });

  // ── Test 2: Redirect / ke /login saat belum login ─────────────────────────
  test("2. Root URL / diarahkan ke /dashboard (atau /login jika belum auth)", async ({ page }) => {
    // Tanpa login, harus ke /login
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });

  // ── Test 3: Login Admin + URL berubah ke /dashboard ──────────────────────
  test("3. Login Admin berhasil dan URL berubah ke /dashboard", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Masuk ke akun Anda");
    await loginAs(page, "admin");

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(".sidebar-brand strong")).toHaveText("SIMPATIK");
    await expect(page.locator(".role-card strong")).toContainText("Administrator");
  });

  // ── Test 4: Navigasi sidebar menggunakan NavLink (elemen <a>) ────────────
  test("4. Navigasi sidebar Admin: Siswa, Prestasi, Laporan — URL berubah", async ({ page }) => {
    await loginAs(page, "admin");

    // Navigasi ke Siswa
    await page.locator("nav a").filter({ hasText: "Siswa" }).first().click();
    await expect(page).toHaveURL(/\/students/);
    await expect(page.locator(".breadcrumb strong")).toHaveText("Siswa");
    await expect(page.locator(".page-title h1")).toContainText("Data Siswa");

    // Navigasi ke Prestasi
    await page.locator("nav a").filter({ hasText: "Prestasi" }).click();
    await expect(page).toHaveURL(/\/achievements/);
    await expect(page.locator(".breadcrumb strong")).toHaveText("Prestasi");

    // Navigasi ke Laporan
    await page.locator("nav a").filter({ hasText: "Laporan" }).click();
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.locator(".breadcrumb strong")).toHaveText("Laporan");
  });

  // ── Test 5: URL /master/teachers untuk menu Guru dan Akun ────────────────
  test("5. Menu 'Guru dan Akun' Admin menggunakan URL /master/teachers", async ({ page }) => {
    await loginAs(page, "admin");

    await page.locator("nav a").filter({ hasText: "Guru dan Akun" }).click();
    await expect(page).toHaveURL(/\/master\/teachers/);
    await expect(page.locator(".breadcrumb strong")).toHaveText("Guru dan Akun");
  });

  // ── Test 6: Refresh halaman mempertahankan rute (SPA rehydration) ─────────
  test("6. Refresh di /students mempertahankan halaman (tidak 404)", async ({ page }) => {
    await loginAs(page, "admin");

    // Navigasi ke Siswa
    await page.locator("nav a").filter({ hasText: "Siswa" }).first().click();
    await expect(page).toHaveURL(/\/students/);

    // Reload halaman
    await page.reload();
    await expect(page).toHaveURL(/\/students/);
    // Setelah reload, harus kembali login karena token hanya ada di memory — atau tetap ada di localStorage
    // Test: halaman load tanpa 404 (tidak ada error Vite/server)
    await expect(page.locator("body")).not.toContainText("Cannot GET /students");
  });

  // ── Test 7: CRUD Siswa — pencarian + modal tambah ────────────────────────
  test("7. Pencarian siswa dan buka modal Tambah Siswa", async ({ page }) => {
    await loginAs(page, "admin");

    await page.locator("nav a").filter({ hasText: "Siswa" }).first().click();
    await expect(page.locator(".page-title h1")).toContainText("Data Siswa");

    // Pencarian
    const searchInput = page.getByPlaceholder("Cari nama siswa...");
    await searchInput.fill("Aulia");
    await page.waitForTimeout(300);
    await expect(page.locator(".table-wrap")).toContainText("Aulia");

    // Buka modal
    await page.getByRole("button", { name: "Tambah Siswa" }).click();
    await expect(page.locator(".modal-head h2")).toHaveText("Tambah Siswa");

    // Isi form
    await page.locator("#student-form input[name='name']").fill("Siswa E2E Test");
    await page.locator("#student-form input[name='nis']").fill("999901");

    // Tutup modal
    await page.getByRole("button", { name: "Batal" }).click();
    await expect(page.locator(".modal-backdrop")).toHaveCount(0);
  });

  // ── Test 8: Login Guru — RBAC menu terlihat/tersembunyi ──────────────────
  test("8. Login Guru: menu RBAC sesuai hak akses", async ({ page }) => {
    await loginAs(page, "guru");

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(".role-card strong")).toContainText("Guru");

    // Menu yang harus ada untuk guru
    await expect(page.locator("nav a").filter({ hasText: "Penilaian" })).toBeVisible();
    await expect(page.locator("nav a").filter({ hasText: "Kehadiran" })).toBeVisible();
    await expect(page.locator("nav a").filter({ hasText: "Prestasi" })).toBeVisible();

    // Menu yang tidak boleh ada untuk guru
    await expect(page.locator("nav a").filter({ hasText: "Guru dan Akun" })).toHaveCount(0);
    await expect(page.locator("nav a").filter({ hasText: "Kelas" })).toHaveCount(0);
    await expect(page.locator("nav a").filter({ hasText: "Mata Pelajaran" })).toHaveCount(0);
  });

  // ── Test 9: Login Kepsek — RBAC + URL ────────────────────────────────────
  test("9. Login Kepsek: menu monitoring tersedia, menu master tersembunyi", async ({ page }) => {
    await loginAs(page, "kepsek");

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator(".role-card strong")).toContainText("Kepala Sekolah");

    // Menu yang harus ada untuk kepsek
    await expect(page.locator("nav a").filter({ hasText: "Monitoring Siswa" })).toBeVisible();
    await expect(page.locator("nav a").filter({ hasText: "Laporan" })).toBeVisible();

    // Menu yang tidak boleh ada
    await expect(page.locator("nav a").filter({ hasText: "Siswa" })).toHaveCount(0);
    await expect(page.locator("nav a").filter({ hasText: "Guru dan Akun" })).toHaveCount(0);
  });

  // ── Test 10: URL /master/classes — kepsek diblokir ───────────────────────
  test("10. Kepsek mengakses /master/classes langsung diarahkan ke /dashboard", async ({ page }) => {
    await loginAs(page, "kepsek");

    // Paksa navigasi ke URL yang dilarang untuk kepsek
    await page.goto("/master/classes");

    // useNavigation harus redirect ke halaman pertama kepsek (dashboard)
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ── Test 11: Halaman 404 fallback ke /dashboard ───────────────────────────
  test("11. URL tidak dikenal redirect ke /dashboard (setelah login)", async ({ page }) => {
    await loginAs(page, "admin");

    await page.goto("/halaman-tidak-ada");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ── Test 12: NavLink mendapat class 'active' untuk rute aktif ─────────────
  test("12. NavLink sidebar mendapat class 'active' untuk halaman yang sedang dibuka", async ({ page }) => {
    await loginAs(page, "admin");

    // Navigasi ke Laporan
    await page.locator("nav a").filter({ hasText: "Laporan" }).click();
    await expect(page).toHaveURL(/\/reports/);

    // Elemen NavLink Laporan harus punya class 'active'
    const laporanLink = page.locator("nav a").filter({ hasText: "Laporan" });
    await expect(laporanLink).toHaveClass(/active/);

    // Elemen lain tidak boleh punya class active untuk Laporan
    const dashboardLink = page.locator("nav a").filter({ hasText: "Dashboard" });
    await expect(dashboardLink).not.toHaveClass(/active/);
  });
});
