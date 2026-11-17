import { describe, it, expect } from 'vitest'
import { canAccessPage, rolePages, pages, type Role, type Page } from '../../src/models/app'
import { mapStudent, mapAchievement, studentsSeed, achievementsSeed } from '../../src/models/data'
import type { ApiStudent, ApiAchievement } from '../../src/api'

describe('Frontend Models & RBAC Permissions', () => {
  describe('canAccessPage', () => {
    it('memberikan akses penuh dashboard, siswa, guru, kelas kepada admin', () => {
      expect(canAccessPage('admin', 'dashboard')).toBe(true)
      expect(canAccessPage('admin', 'students')).toBe(true)
      expect(canAccessPage('admin', 'teachers')).toBe(true)
      expect(canAccessPage('admin', 'classes')).toBe(true)
      expect(canAccessPage('admin', 'reports')).toBe(true)
    })

    it('membatasi halaman kepala sekolah hanya untuk grades, achievements, dan reports', () => {
      expect(canAccessPage('kepsek', 'grades')).toBe(true)
      expect(canAccessPage('kepsek', 'achievements')).toBe(true)
      expect(canAccessPage('kepsek', 'reports')).toBe(true)
      expect(canAccessPage('kepsek', 'dashboard')).toBe(false)
      expect(canAccessPage('kepsek', 'teachers')).toBe(false)
      expect(canAccessPage('kepsek', 'classes')).toBe(false)
    })

    it('mengizinkan guru mengakses nilai, absensi, siswa, prestasi, dan monitoring', () => {
      expect(canAccessPage('guru', 'grades')).toBe(true)
      expect(canAccessPage('guru', 'attendance')).toBe(true)
      expect(canAccessPage('guru', 'students')).toBe(true)
      expect(canAccessPage('guru', 'achievements')).toBe(true)
      expect(canAccessPage('guru', 'monitoring')).toBe(true)
      expect(canAccessPage('guru', 'teachers')).toBe(false)
    })
  })

  describe('Data Mappers', () => {
    it('memetakan ApiStudent ke Student UI model dengan benar', () => {
      const apiStudent: ApiStudent = {
        id: 'uuid-1',
        nis: '2026001',
        nama: 'Ahmad Dahlan',
        kelas: { id: 'k-1', nama: 'Kelas VII-A' }
      }
      const mapped = mapStudent(apiStudent)
      expect(mapped.id).toBe('uuid-1')
      expect(mapped.nis).toBe('2026001')
      expect(mapped.name).toBe('Ahmad Dahlan')
      expect(mapped.className).toBe('Kelas VII-A')
      expect(mapped.classId).toBe('k-1')
      expect(mapped.status).toBe('Aktif')
    })

    it('menangani siswa tanpa alokasi kelas (kelas = null)', () => {
      const apiStudent: ApiStudent = {
        id: 'uuid-2',
        nis: '2026002',
        nama: 'Budi Santoso',
        kelas: null
      }
      const mapped = mapStudent(apiStudent)
      expect(mapped.className).toBe('Belum ditempatkan')
      expect(mapped.classId).toBeUndefined()
    })

    it('memetakan ApiAchievement dengan status DIVERIFIKASI -> Terverifikasi', () => {
      const apiAch: ApiAchievement = {
        id: 'ach-1',
        judul: 'Juara 1 OSN Matematika',
        bidang: 'Akademik',
        tingkat: 'Nasional',
        peringkat: 'Emas',
        statusVerifikasi: 'DIVERIFIKASI',
        tanggalPerolehan: '2026-05-10T00:00:00.000Z',
        siswa: { id: 's-1', nama: 'Siti Rahma' }
      }
      const mapped = mapAchievement(apiAch)
      expect(mapped.id).toBe('ach-1')
      expect(mapped.name).toBe('Juara 1 OSN Matematika')
      expect(mapped.status).toBe('Terverifikasi')
      expect(mapped.student).toBe('Siti Rahma')
      expect(mapped.result).toBe('Emas')
    })

    it('memetakan status DITOLAK -> Perlu Revisi dan default Menunggu Verifikasi', () => {
      const apiAchRejected: ApiAchievement = {
        id: 'ach-2',
        judul: 'Sertifikat Seminar',
        bidang: 'Lainnya',
        tingkat: 'Sekolah',
        statusVerifikasi: 'DITOLAK',
        tanggalPerolehan: '2026-06-01T00:00:00.000Z',
      }
      expect(mapAchievement(apiAchRejected).status).toBe('Perlu Revisi')

      const apiAchPending: ApiAchievement = {
        id: 'ach-3',
        judul: 'Lomba Puisi',
        bidang: 'Seni',
        tingkat: 'Kota',
        statusVerifikasi: 'DIAJUKAN',
        tanggalPerolehan: '2026-06-01T00:00:00.000Z',
      }
      expect(mapAchievement(apiAchPending).status).toBe('Menunggu Verifikasi')
    })
  })

  describe('Seed Integrity Check', () => {
    it('memastikan data seed lokal valid', () => {
      expect(studentsSeed.length).toBeGreaterThan(0)
      expect(achievementsSeed.length).toBeGreaterThan(0)
      expect(studentsSeed[0]).toHaveProperty('nis')
      expect(achievementsSeed[0]).toHaveProperty('status')
    })
  })
})
