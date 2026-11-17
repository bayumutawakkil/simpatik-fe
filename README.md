# SIMPATIK Frontend (Web App)

Aplikasi Web Frontend SIMPATIK berbasis React 19, TypeScript, Vite, dan Tailwind CSS untuk antarmuka pengguna sistem informasi akademik.

---

## 1. Prasyarat & Instalasi

- **Node.js**: v18+ (direkomendasikan v20+)
- **NPM**: v9+

### Instalasi Dependensi:
```bash
npm install
```

---

## 2. Menjalankan Server Pengembangan

```bash
# Menjalankan Vite dev server
npm run dev

# Membangun bundle produksi
npm run build

# Menjalankan preview hasil build produksi
npm run preview
```

---

## 3. Pengujian Otomatis (Testing)

Frontend SIMPATIK dilengkapi dengan dua lapisan pengujian otomatis:

### A. White-Box Unit Test (Vitest)
Menguji logika utilitas, model RBAC, mapper API data, custom hooks (`useNavigation`, `useSession`), serta API client menggunakan environment `jsdom` (komponen UI statis dikecualikan dari coverage).

```bash
# Menjalankan unit test
npm test

# Menjalankan unit test dengan laporan code coverage v8
npm run test:coverage
```
Laporan coverage HTML tersedia di folder `coverage/index.html`.

### B. Black-Box End-to-End Test (Playwright)
Menguji skenario alur pengguna nyata (login kredensial, navigasi antar halaman, pencarian & modal CRUD siswa, serta validasi hak akses guru) menggunakan browser Chromium.

```bash
# Menjalankan skenario E2E Playwright
npm run test:e2e
```
Laporan interaktif Playwright, traces, dan rekaman screenshot tersimpan di `playwright-report/index.html` dan `test-results/`.
