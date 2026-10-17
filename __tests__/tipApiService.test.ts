import AsyncStorage from '@react-native-async-storage/async-storage';
import { tipApiService } from '../src/services/tipApiService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

describe('tipApiService (Sprint 5 - HU-34)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = mockFetch;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-jwt-token');
  });

  it('HU-34: retrieves active tips for the user in the mobile app', async () => {
    const tips = [
      {
        id: 1,
        title: 'Separa los envases plásticos',
        description: 'Enjuaga y seca las botellas PET antes de entregarlas.',
        is_active: true,
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: tips,
      }),
    });

    const result = await tipApiService.getTips();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Separa los envases plásticos');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/tips_app'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('HU-34: throws an error when fetching tips fails or when token is absent', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(tipApiService.getTips()).rejects.toThrow('Error al obtener tips');
  });
});

