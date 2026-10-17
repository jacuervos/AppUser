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

  it('HU-35: retrieves and maps all user levels with their corresponding icons and point ranges', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        levels: [
          { id: 1, name: 'Semilla Verde', min_point: 0, max_point: 100 },
          { id: 2, name: 'Aprendiz del Reciclaje', min_point: 101, max_point: 200 },
          { id: 3, name: 'Guardián del Medio Ambiente', min_point: 201, max_point: 300 },
          { id: 4, name: 'Recolector Responsable', min_point: 301, max_point: 400 },
          { id: 5, name: 'Constructor Ecológico', min_point: 401, max_point: 500 },
          { id: 6, name: 'Héroe Verde', min_point: 501, max_point: 600 },
          { id: 7, name: 'Embajador del Reciclaje', min_point: 601, max_point: 700 },
          { id: 8, name: 'Defensor Planetario', min_point: 701, max_point: 800 },
          { id: 9, name: 'Maestro Eco-Sabio', min_point: 801, max_point: 900 },
          { id: 10, name: 'Leyenda del Reciclaje', min_point: 901, max_point: 1000 },
          { id: 11, name: 'Nivel Personalizado', min_point: 1001, max_point: 2000 },
        ],
      }),
    });

    const result = await levelApiService.levelTypes();

    expect(result).toEqual([
      { id: '1', name: 'Semilla Verde', icon: 'seedling', min: 0, max: 100 },
      { id: '2', name: 'Aprendiz del Reciclaje', icon: 'leaf', min: 101, max: 200 },
      { id: '3', name: 'Guardián del Medio Ambiente', icon: 'shield-alt', min: 201, max: 300 },
      { id: '4', name: 'Recolector Responsable', icon: 'recycle', min: 301, max: 400 },
      { id: '5', name: 'Constructor Ecológico', icon: 'hammer', min: 401, max: 500 },
      { id: '6', name: 'Héroe Verde', icon: 'star', min: 501, max: 600 },
      { id: '7', name: 'Embajador del Reciclaje', icon: 'medal', min: 601, max: 700 },
      { id: '8', name: 'Defensor Planetario', icon: 'globe-americas', min: 701, max: 800 },
      { id: '9', name: 'Maestro Eco-Sabio', icon: 'crown', min: 801, max: 900 },
      { id: '10', name: 'Leyenda del Reciclaje', icon: 'trophy', min: 901, max: 1000 },
      { id: '11', name: 'Nivel Personalizado', icon: 'seedling', min: 1001, max: 2000 },
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
