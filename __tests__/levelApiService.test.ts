import AsyncStorage from '@react-native-async-storage/async-storage';
import { levelApiService } from '../src/services/levelApiService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

describe('levelApiService (Sprint 5 - HU-35)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = mockFetch;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-jwt-token');
  });

  it('HU-35: retrieves and maps user levels with icons and point ranges', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        levels: [
          { id: 1, name: 'Semilla Verde', min_point: 0, max_point: 100 },
          { id: 2, name: 'Guardián del Medio Ambiente', min_point: 101, max_point: 300 },
          { id: 3, name: 'Héroe Verde', min_point: 301, max_point: 600 },
        ],
      }),
    });

    const result = await levelApiService.levelTypes();

    expect(result).toEqual([
      { id: '1', name: 'Semilla Verde', icon: 'seedling', min: 0, max: 100 },
      { id: '2', name: 'Guardián del Medio Ambiente', icon: 'shield-alt', min: 101, max: 300 },
      { id: '3', name: 'Héroe Verde', icon: 'star', min: 301, max: 600 },
    ]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/all-levels-user'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('HU-35: throws an error when fetching levels fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(levelApiService.levelTypes()).rejects.toThrow('Error al obtener los niveles');
  });
});

