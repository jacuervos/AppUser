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
  let reqFulfilled: any;
  let reqRejected: any;
  let resFulfilled: any;
  let resRejected: any;

  const httpClient = {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn((onFulfilled, onRejected) => {
          reqFulfilled = onFulfilled;
          reqRejected = onRejected;
        }),
      },
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          resFulfilled = onFulfilled;
          resRejected = onRejected;
        }),
      },
    },
  };

  (axios.create as jest.Mock).mockReturnValue(httpClient);
  const { authApiService } = require('../src/services/authApiService');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('configures request and response interceptors properly', async () => {
    const loginConfig = await reqFulfilled({ url: '/login', headers: {} });
    expect(loginConfig.headers.Authorization).toBeUndefined();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('stored-token');
    const authConfig = await reqFulfilled({ url: '/auth_me', headers: {} });
    expect(authConfig.headers.Authorization).toBe('Bearer stored-token');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const noTokenConfig = await reqFulfilled({ url: '/other', headers: {} });
    expect(noTokenConfig.headers.Authorization).toBeUndefined();

    await expect(reqRejected(new Error('req-err'))).rejects.toThrow('req-err');

    const okRes = { status: 200 };
    expect(resFulfilled(okRes)).toBe(okRes);

    await expect(
      resRejected({ response: { status: 401 }, config: { url: '/auth_me' } })
    ).rejects.toBeDefined();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['access_token', 'user_info']);

    (AsyncStorage.multiRemove as jest.Mock).mockClear();
    await expect(
      resRejected({ response: { status: 401 }, config: { url: '/firebase-token' } })
    ).rejects.toBeDefined();
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();

    await expect(resRejected({ response: { status: 500 } })).rejects.toBeDefined();
  });

  it('stores the access token after login and handles token variations', async () => {
    httpClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          access_token: 'mobile-token',
          rol: 'Usuario',
        },
      },
    });

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

    // Top-level token without data object
    httpClient.post.mockResolvedValueOnce({
      data: {
        token: 'alt-token',
      },
    });
    const altRes = await authApiService.login({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(altRes.data.access_token).toBe('alt-token');

    // No token returned
    httpClient.post.mockResolvedValueOnce({
      data: {
        success: false,
      },
    });
    const noTokenRes = await authApiService.login({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(noTokenRes.success).toBe(false);
  });

  it('stores the user info after loading profile', async () => {
    httpClient.get.mockResolvedValueOnce({
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

    const response = await authApiService.getUserInfo();

    expect(response.success).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_info',
      expect.stringContaining('Maria Lopez')
    );
    expect(httpClient.get).toHaveBeenCalledWith('/auth_me');

    // When success is false
    (AsyncStorage.setItem as jest.Mock).mockClear();
    httpClient.get.mockResolvedValueOnce({
      data: { success: false, data: null },
    });
    const resFalse = await authApiService.getUserInfo();
    expect(resFalse.success).toBe(false);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('registers a user using multipart form-data and updates user profile', async () => {
    httpClient.post.mockResolvedValueOnce({
      data: {
        code: 200,
        message: 'Se ha creado el usuario correctamente',
      },
    });

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

    // Update user with image
    httpClient.patch.mockResolvedValueOnce({
      data: { code: 200, message: 'Actualizado con foto' },
    });
    const updateWithImg = await authApiService.update(
      {
        name: 'Maria Lopez',
        phone: '3009998877',
        identification: '100200300',
        images: 'file:///tmp/new-photo.png',
      },
      1
    );
    expect(updateWithImg.code).toBe(200);
    expect(httpClient.patch).toHaveBeenCalledWith(
      '/user/1',
      expect.any(FormData),
      expect.any(Object)
    );

    // Update user without image
    httpClient.patch.mockResolvedValueOnce({
      data: { code: 200, message: 'Actualizado sin foto' },
    });
    const updateNoImg = await authApiService.update(
      {
        name: 'Maria Lopez',
        phone: '3009998877',
        identification: '100200300',
      } as any,
      1
    );
    expect(updateNoImg.code).toBe(200);
  });

  it('sends a password recovery email, validates token, and resets password', async () => {
    httpClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Código enviado',
      },
    });

    const response = await authApiService.forgotPassword({ email: 'maria@example.com' });
    expect(response.success).toBe(true);
    expect(httpClient.post).toHaveBeenCalledWith('/send_code', { email: 'maria@example.com' });

    httpClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Código válido',
      },
    });
    const validRes = await authApiService.validateResetToken({
      email: 'maria@example.com',
      token: '654321',
    });
    expect(validRes.success).toBe(true);
    expect(httpClient.post).toHaveBeenCalledWith('/validate_code', { code: '654321' });

    httpClient.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Contraseña actualizada',
      },
    });

    const resetRes = await authApiService.resetPassword({
      email: 'maria@example.com',
      token: '654321',
      password: 'NuevaPass123',
      password_confirmation: 'NuevaPass123',
    });

    expect(resetRes.success).toBe(true);
    expect(httpClient.post).toHaveBeenCalledWith('/change_password', {
      email: 'maria@example.com',
      token: '654321',
      password: 'NuevaPass123',
      password_confirmation: 'NuevaPass123',
      code: '654321',
    });
  });

  it('manages firebase token, logout, and storage helpers', async () => {
    httpClient.post.mockResolvedValueOnce({ data: { success: true } });
    await authApiService.updateFirebaseToken('fb-token-123');
    expect(httpClient.post).toHaveBeenCalledWith('/firebase-token', {
      firebase_token: 'fb-token-123',
    });

    await authApiService.logout();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['access_token', 'user_info']);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('jwt-1');
    expect(await authApiService.isAuthenticated()).toBe(true);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await authApiService.isAuthenticated()).toBe(false);

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage err'));
    expect(await authApiService.isAuthenticated()).toBe(false);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('jwt-2');
    expect(await authApiService.getStoredToken()).toBe('jwt-2');

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage err'));
    expect(await authApiService.getStoredToken()).toBeNull();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({ id: 9 }));
    expect(await authApiService.getStoredUserInfo()).toEqual({ id: 9 });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    expect(await authApiService.getStoredUserInfo()).toBeNull();

    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage err'));
    expect(await authApiService.getStoredUserInfo()).toBeNull();
  });

  it('formats API, network, and unexpected errors across all methods', async () => {
    httpClient.post.mockRejectedValueOnce({
      response: { status: 422, data: { message: 'Datos inválidos' } },
    });
    await expect(authApiService.register({
      name: 'Maria',
      phone: '123',
      identification: '123',
      type_identification: 1,
      email: 'a@b.com',
      password: '123',
      password_confirmation: '123',
      images: 'file:///a.png',
    })).rejects.toThrow('Datos inválidos');

    httpClient.post.mockRejectedValueOnce({
      response: { status: 401, statusText: 'Unauthorized', data: {} },
    });
    await expect(
      authApiService.login({ email: 'a@b.com', password: 'bad' })
    ).rejects.toThrow('Error 401: Unauthorized');

    httpClient.post.mockRejectedValueOnce({ request: {} });
    await expect(authApiService.updateFirebaseToken('t')).rejects.toThrow(
      'No se pudo conectar con el servidor'
    );

    httpClient.patch.mockRejectedValueOnce({});
    await expect(
      authApiService.update({ name: 'A', phone: '1', identification: '1' } as any, 1)
    ).rejects.toThrow('Ocurrió un error inesperado');

    httpClient.get.mockRejectedValueOnce(new Error('Err perfil'));
    await expect(authApiService.getUserInfo()).rejects.toThrow('Err perfil');

    (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(new Error('Err logout'));
    await expect(authApiService.logout()).rejects.toThrow('Err logout');

    httpClient.post.mockRejectedValueOnce(new Error('Err forgot'));
    await expect(authApiService.forgotPassword({ email: 'a@b.com' })).rejects.toThrow(
      'Err forgot'
    );

    httpClient.post.mockRejectedValueOnce(new Error('Err validate'));
    await expect(
      authApiService.validateResetToken({ email: 'a@b.com', token: '1' })
    ).rejects.toThrow('Err validate');

    httpClient.post.mockRejectedValueOnce(new Error('Err reset'));
    await expect(
      authApiService.resetPassword({
        email: 'a@b.com',
        token: '1',
        password: '1',
        password_confirmation: '1',
      })
    ).rejects.toThrow('Err reset');
  });
});