import { test, expect } from '@playwright/test';

test.describe('E2E SIMPATIK Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Kunjungi aplikasi web frontend
    await page.goto('/');
  });

  test('1. Alur Login Kredensial dan Navigasi Dashboard Admin', async ({ page }) => {
    // Verifikasi berada di halaman login
    await expect(page.locator('h2')).toContainText('Masuk ke akun Anda');

    // Klik tombol Demo Admin untuk mengisi form secara otomatis
    const demoAdminBtn = page.getByRole('button', { name: 'Demo Admin' });
    await demoAdminBtn.click();

    // Verifikasi input username terisi (bisa 'admin' atau 'admin@simpatik.test')
    const usernameInput = page.getByPlaceholder('Masukkan username');
    await expect(usernameInput).not.toBeEmpty();

    // Klik submit Masuk ke SIMPATIK
    const submitBtn = page.getByRole('button', { name: 'Masuk ke SIMPATIK' });
    await submitBtn.click();

    // Verifikasi berhasil login dan masuk ke App Shell / Dashboard
    await expect(page.locator('.sidebar-brand strong')).toHaveText('SIMPATIK');
    await expect(page.locator('.role-card strong')).toContainText('Administrator');
  });

  test('2. Alur Navigasi Antar Halaman & Pengecekan Akses Menu Admin', async ({ page }) => {
    // Login terlebih dahulu sebagai admin
    await page.getByRole('button', { name: 'Demo Admin' }).click();
    await page.getByRole('button', { name: 'Masuk ke SIMPATIK' }).click();
    await expect(page.locator('.role-card strong')).toContainText('Administrator');

    // Navigasi ke Halaman Siswa
    const siswaMenu = page.locator('nav').getByRole('button', { name: 'Siswa', exact: true });
    await siswaMenu.click();
    await expect(page.locator('.breadcrumb strong')).toHaveText('Siswa');
    await expect(page.locator('.page-title h1')).toContainText('Data Siswa');

    // Navigasi ke Halaman Prestasi
    const prestasiMenu = page.locator('nav').getByRole('button', { name: 'Prestasi' });
    await prestasiMenu.click();
    await expect(page.locator('.breadcrumb strong')).toHaveText('Prestasi');

    // Navigasi ke Halaman Laporan
    const laporanMenu = page.locator('nav').getByRole('button', { name: 'Laporan' });
    await laporanMenu.click();
    await expect(page.locator('.breadcrumb strong')).toHaveText('Laporan');
  });

  test('3. Alur CRUD Fitur Inti Siswa (Pencarian & Buka Modal Tambah Siswa)', async ({ page }) => {
    // Login sebagai Admin
    await page.getByRole('button', { name: 'Demo Admin' }).click();
    await page.getByRole('button', { name: 'Masuk ke SIMPATIK' }).click();

    // Buka menu Siswa
    await page.locator('nav').getByRole('button', { name: 'Siswa', exact: true }).click();
    await expect(page.locator('.page-title h1')).toContainText('Data Siswa');

    // Tes Fitur Pencarian Tabel Siswa
    const searchInput = page.getByPlaceholder('Cari nama siswa...');
    await searchInput.fill('Aulia');
    await page.waitForTimeout(300);

    // Verifikasi hasil filter
    await expect(page.locator('.table-wrap')).toContainText('Aulia');

    // Buka Modal Tambah Siswa
    const tambahBtn = page.getByRole('button', { name: 'Tambah Siswa' });
    await tambahBtn.click();

    // Verifikasi dialog modal terbuka
    const modalTitle = page.locator('.modal-head h2');
    await expect(modalTitle).toHaveText('Tambah Siswa');

    // Isi formulir siswa baru dengan selektor spesifik di dalam modal
    await page.locator('#student-form input[name="name"]').fill('Siswa E2E Test Playwright');
    await page.locator('#student-form input[name="nis"]').fill('999901');

    // Tutup modal dengan tombol Batal
    await page.getByRole('button', { name: 'Batal' }).click();
    await expect(page.locator('.modal-backdrop')).toHaveCount(0);
  });

  test('4. Alur Login Guru & Pembatasan Hak Akses (Role-Based Access Control)', async ({ page }) => {
    // Login sebagai Guru
    await page.getByRole('button', { name: 'Demo Guru' }).click();
    await page.getByRole('button', { name: 'Masuk ke SIMPATIK' }).click();

    // Verifikasi info sesi guru
    await expect(page.locator('.role-card strong')).toContainText('Guru');

    // Guru memiliki menu Penilaian & Kehadiran, namun TIDAK memiliki menu Kelas & Guru
    await expect(page.locator('nav').getByRole('button', { name: 'Penilaian' })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: 'Guru dan Akun' })).toHaveCount(0);
    await expect(page.locator('nav').getByRole('button', { name: 'Kelas' })).toHaveCount(0);
  });
});
