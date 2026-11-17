import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from '../../src/api'

describe('API Client Unit Tests', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('mengirim header Authorization ketika token tersimpan di localStorage', async () => {
    localStorage.setItem('token', 'my-auth-jwt')

    const mockResponse = {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: { id: 'user-1', name: 'Bambang' } }),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const res = await api.me()
    expect(res).toEqual({ id: 'user-1', name: 'Bambang' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me'),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    )
  })

  it('melempar pesan error yang sesuai saat respons backend gagal (success: false)', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: false, error: { message: 'Kredensial tidak valid' } }),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(api.login('admin@test.com', 'wrongpass')).rejects.toThrow('Kredensial tidak valid')
  })
})
