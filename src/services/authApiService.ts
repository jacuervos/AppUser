import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginCredentials,
  LoginResponse,
  UserInfoResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RegisterCredentials,
  RegisterResponse, UpdateCredentials, UserUpdateResponse,
} from '../types/auth.types';

class AuthApiService {
  private authApi: AxiosInstance;
  private userApi: AxiosInstance;

  constructor() {
    const authURL = 'https://ms-auth-eha5d8bchthmdtd7.canadacentral-01.azurewebsites.net/api';
    const userURL = 'https://ms-user-ezcndjd8cefgazc6.canadacentral-01.azurewebsites.net/api';

    this.authApi = axios.create({
      baseURL: authURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    this.userApi = axios.create({
      baseURL: userURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors(this.authApi);
    this.setupInterceptors(this.userApi);

  }

  /**
   * Interceptors
   */
  private setupInterceptors(apiInstance: AxiosInstance) {
    apiInstance.interceptors.request.use(
        async (config) => {
          if (config.url?.includes('/login')) {
            return config;
          }

          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          return config;
        },
        (error) => Promise.reject(error)
    );

    apiInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            await AsyncStorage.multiRemove(['access_token', 'user_info']);
          }
          return Promise.reject(error);
        }
    );
  }

  /**
   * Register user with diferents params
   * @param credentials - Email, password, name, phone, identification, typeIdentification
   * @returns Register response with info user
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('phone', credentials.phone);
      formData.append('identification', credentials.identification);
      formData.append('type_identification', credentials.type_identification);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      formData.append('password_confirmation', credentials.password_confirmation);
      formData.append('images', {
        uri: credentials.images,
        type: 'image/png',
        name: `image_${credentials.name.replace(/\s+/g, '_')}_${credentials.identification}.png`,
      });
      const response: AxiosResponse<RegisterResponse> = await this.authApi.post(
          '/register_user',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user with email and password
   * @param credentials - Email and password
   * @returns Login response with token and role
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {

      const response: AxiosResponse<LoginResponse> = await this.authApi.post('/login', credentials);

      // Save token to AsyncStorage
      if (response.data.success && response.data.data.access_token) {
        await AsyncStorage.setItem('access_token', response.data.data.access_token);
      }

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateFirebaseToken(firebaseToken: string): Promise<void> {
    try {
      await this.authApi.post('/firebase-token', {
        firebase_token: firebaseToken,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user with diferents params
   * @param credentials - Name, phone, photo
   * @param id
   * @returns Update response with info user
   */
  async update(credentials: UpdateCredentials, id: number): Promise<UserUpdateResponse> {
    try {
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('phone', credentials.phone);
      if(credentials?.images){
        formData.append('images', {
          uri: credentials.images,
          type: 'image/png',
          name: `image_${credentials.name.replace(/\s+/g, '_')}_${credentials.identification}.png`,
        });
      }
      const response: AxiosResponse<UserUpdateResponse> = await this.userApi.patch(
          `/user/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user information
   * @returns User information
   */
  async getUserInfo(): Promise<UserInfoResponse> {
    try {
      const response: AxiosResponse<UserInfoResponse> = await this.authApi.get('/auth_me');

      // Save user info to AsyncStorage
      if (response.data.success && response.data.data) {
        await AsyncStorage.setItem('user_info', JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      console.error('Get user info error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user - clear tokens and data
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['access_token', 'user_info']);
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check if user has valid token
   * @returns boolean indicating if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  /**
   * Get stored token
   * @returns stored access token or null
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }

  /**
   * Get stored user info
   * @returns stored user info or null
   */
  async getStoredUserInfo(): Promise<any | null> {
    try {
      const userInfo = await AsyncStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Get stored user info error:', error);
      return null;
    }
  }

  /**
   * Handle API errors
   * @param error - Error from API call
   * @returns formatted error message
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      // Something else happened
      return new Error(error.message || 'Ocurrió un error inesperado');
    }
  }

  /**
   * Send forgot password email
   * @returns Response indicating if email was sent
   * @param request
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await this.authApi.post('/send_code', request);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate password reset token
   * @param request - Email and token
   * @returns Response indicating if token is valid
   */
  async validateResetToken(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    try {
      const values = {
        code: request.token,
      }
      const response: AxiosResponse<ValidateTokenResponse> = await this.authApi.post('/validate_code', values);
      return response.data;
    } catch (error) {
      console.error('Validate token error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   * @param request - Email, token and new password
   * @returns Response indicating if password was reset
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const values = {
        code: request.token,
        ...request,
      }
      const response: AxiosResponse<ResetPasswordResponse> = await this.authApi.post('/change_password', values);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
export default authApiService;
