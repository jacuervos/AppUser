import AsyncStorage from '@react-native-async-storage/async-storage';
import { blogApiService } from '../src/services/blogApiService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

describe('blogApiService (Sprint 5 - HU-33)', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = mockFetch;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-jwt-token');
  });

  it('HU-33: retrieves active blogs for the user in the mobile app', async () => {
    const blogs = [
      {
        id: 1,
        title: 'Guía de reciclaje en casa',
        description: 'Cómo clasificar residuos en el hogar.',
        url: 'https://greencity.test/blog-reciclaje',
        image: 'https://greencity.test/images/blog1.png',
        is_active: true,
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: blogs,
      }),
    });

    const result = await blogApiService.getBlogs();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Guía de reciclaje en casa');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/blogs_app'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer user-jwt-token',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('HU-33: throws an error when fetching blogs fails or when token is absent', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    mockFetch.mockResolvedValue({
      ok: false,
    });

    await expect(blogApiService.getBlogs()).rejects.toThrow('Error al obtener blogs');
  });
});

