import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNavigation } from '../../src/controllers/navigationController'
import { useSession } from '../../src/controllers/sessionController'
import { api } from '../../src/api'

vi.mock('../../src/api', () => ({
  api: {
    me: vi.fn(),
    logout: vi.fn(),
  },
}))

describe('Frontend Custom Hooks & Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.location.hash = ''
    localStorage.clear()
    vi.mocked(api.me).mockResolvedValue({ id: 'u1', role: 'ADMIN', name: 'Admin' } as any)
    vi.mocked(api.logout).mockResolvedValue(undefined as any)
  })

  describe('useNavigation Hook', () => {
    it('menginisialisasi halaman default ke dashboard saat hash kosong', () => {
      const { result } = renderHook(() => useNavigation('admin'))
      expect(result.current.page).toBe('dashboard')
    })

    it('dapat berpindah halaman dan mengubah location hash', () => {
      const { result } = renderHook(() => useNavigation('admin'))
      act(() => {
        result.current.go('students')
      })
      expect(result.current.page).toBe('students')
      expect(window.location.hash).toBe('#/students')
    })

    it('secara otomatis mengalihkan (redirect) jika role tidak memiliki izin ke halaman tersebut', () => {
      // Kepsek tidak boleh ke dashboard, harus dialihkan ke grades (halaman pertama kepsek)
      window.location.hash = '#/dashboard'
      const { result } = renderHook(() => useNavigation('kepsek'))
      expect(result.current.page).toBe('grades')
    })
  })

  describe('useSession Hook', () => {
    it('menginisialisasi sesi dengan role null saat tidak ada token', () => {
      const { result } = renderHook(() => useSession())
      expect(result.current.role).toBeNull()
    })

    it('dapat melakukan login dan mengupdate role', () => {
      const { result } = renderHook(() => useSession())
      act(() => {
        result.current.login('admin')
      })
      expect(result.current.role).toBe('admin')
    })

    it('menghapus token dan state saat logout', () => {
      localStorage.setItem('token', 'sample-token')
      localStorage.setItem('user', JSON.stringify({ name: 'Admin' }))

      const { result } = renderHook(() => useSession())
      act(() => {
        result.current.login('admin')
      })
      expect(result.current.role).toBe('admin')

      act(() => {
        result.current.logout()
      })
      expect(result.current.role).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
