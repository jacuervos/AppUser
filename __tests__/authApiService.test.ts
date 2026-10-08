import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

jest.mock('../src/services/pushNotificationService', () => ({
  __esModule: true,
  default: {
    getToken: jest.fn().mockResolvedValue(null),
  },
}));

describe('authApiService', () => {
  const httpClient = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(httpClient);
  });

  it('stores the access token after login', async () => {
    httpClient.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          access_token: 'mobile-token',
          rol: 'Usuario',
        },
      },
    });

    httpClient.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          name: 'Maria Lopez',
          phone: '3001234567',
          email: 'maria@example.com',
          address: null,
          identification: '100200300',
          photo: null,
          points: 10,
          rol: { id: 2, name: 'Usuario' },
          state: { id: 1, name: 'Habilitado', color: 'green' },
        },
        message: 'ok',
      },
    });

    const { authApiService } = require('../src/services/authApiService');

    const response = await authApiService.login({
      email: 'user@example.com',
      password: 'secret123',
    });

    expect(response.data.access_token).toBe('mobile-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', 'mobile-token');
    expect(httpClient.post).toHaveBeenCalledWith('/login', {
      email: 'user@example.com',
      password: 'secret123',
    });
  });

  it('stores the user info after loading profile', async () => {
    httpClient.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          name: 'Maria Lopez',
          phone: '3001234567',
          email: 'maria@example.com',
          address: null,
          identification: '100200300',
          photo: null,
          points: 10,
          rol: { id: 2, name: 'Usuario' },
          state: { id: 1, name: 'Habilitado', color: 'green' },
        },
        message: 'ok',
      },
    });

    const { authApiService } = require('../src/services/authApiService');

    const response = await authApiService.getUserInfo();

    expect(response.success).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_info',
      expect.stringContaining('Maria Lopez')
    );
    expect(httpClient.get).toHaveBeenCalledWith('/auth_me');
  });

  it('registers a user using multipart form-data', async () => {
    httpClient.post.mockResolvedValue({
      data: {
        code: 200,
        message: 'Se ha creado el usuario correctamente',
      },
    });

    const { authApiService } = require('../src/services/authApiService');

    const response = await authApiService.register({
      name: 'Maria Lopez',
      phone: '3001234567',
      identification: '100200300',
      type_identification: 1,
      email: 'maria@example.com',
      password: 'secret123',
      password_confirmation: 'secret123',
      images: 'file:///tmp/user-photo.png',
    });

    expect(response.code).toBe(200);
    expect(httpClient.post).toHaveBeenCalledWith(
      '/register_user',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'multipart/form-data',
        }),
      })
    );
  });
});