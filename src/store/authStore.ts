import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState, LoginCredentials, RegisterCredentials, UpdateCredentials} from '../types/auth.types';
import { authApiService } from '../services/authApiService';
import pushNotificationService from '../services/pushNotificationService';

interface AuthActions {
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  updateProfile: (credentials: UpdateCredentials, id: number) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<void>;

  // State management actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Initialize app - check for stored auth data
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

type AuthPersistApi = {
  persist?: {
    hasHydrated: () => boolean;
    onFinishHydration: (callback: () => void) => () => void;
  };
};

let initializePromise: Promise<void> | null = null;

const waitForHydration = (api: AuthPersistApi): Promise<void> => {
  const persistApi = api.persist;
  if (!persistApi || persistApi.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const unsubscribe = persistApi.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get, api) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      userInfo: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApiService.register(credentials);
          if (response.code === 200) {
            // Post Login
            let values = {
              email: credentials.email.toLowerCase(),
              password: credentials.password,
            };
            await get().login(values);
          } else {
            throw new Error(response.message || 'Error en el registro');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const firebaseToken = await pushNotificationService.getToken();

          const response = await authApiService.login({
            ...credentials,
            firebase_token: firebaseToken,
          });

          const accessToken = response.data?.access_token;
          if (response.success && accessToken) {
            await AsyncStorage.setItem('access_token', accessToken);

            set({
              isAuthenticated: true,
              token: accessToken,
              isLoading: false,
              error: null,
            });

            if (firebaseToken) {
              try {
                await authApiService.updateFirebaseToken(firebaseToken);
              } catch (firebaseError) {
                console.warn('Failed to sync firebase token after login:', firebaseError);
              }
            }

            // Get user info after successful login. Un fallo al leer el
            // perfil no debe borrar el token que ya quedó en AsyncStorage.
            try {
              await get().getUserInfo();
            } catch (userInfoError) {
              const status = (userInfoError as Error & { status?: number }).status;
              if (status === 401) {
                throw userInfoError;
              }
              console.warn('Failed to load user info after login:', userInfoError);
            }
          } else {
            throw new Error(response.message || 'Error en el login');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
          const status = (error as Error & { status?: number }).status;
          const tokenStillStored = await authApiService.getStoredToken();

          if (status === 401 || !tokenStillStored) {
            await AsyncStorage.multiRemove(['access_token', 'user_info']);
            set({
              isAuthenticated: false,
              token: null,
              userInfo: null,
              isLoading: false,
              error: errorMessage,
            });
          } else {
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
          throw error;
        }
      },

      getUserInfo: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApiService.getUserInfo();

          if (response.success) {
            set({
              userInfo: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Error al obtener información del usuario');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al obtener información del usuario';
          set({
            userInfo: null,
            isLoading: false,
            error: errorMessage,
          });

          // If error is 401, logout user
          const status = (error as Error & { status?: number }).status;
          if (status === 401 || (error instanceof Error && error.message.includes('401'))) {
            await get().logout();
          }

          throw error;
        }
      },

      updateProfile: async (credentials: UpdateCredentials, id: number) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApiService.update(credentials, id);
          if (response.code === 200) {
            set({
              userInfo: response.user,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Error la actualización');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await authApiService.logout();

          set({
            isAuthenticated: false,
            token: null,
            userInfo: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      initializeAuth: async () => {
        if (get().isInitialized) {
          return;
        }

        if (!initializePromise) {
          initializePromise = (async () => {
            try {
              // No escribir en AsyncStorage hasta rehidratar. Un set() previo
              // persiste el estado inicial (token null) y borra la sesión.
              await waitForHydration(api as AuthPersistApi);

              const storedToken = await authApiService.getStoredToken();
              const persistedToken = get().token;
              const token = storedToken || persistedToken;

              if (token) {
                if (storedToken !== token) {
                  await AsyncStorage.setItem('access_token', token);
                }

                const storedUserInfo = await authApiService.getStoredUserInfo();

                set({
                  isAuthenticated: true,
                  token,
                  userInfo: get().userInfo ?? storedUserInfo,
                  isLoading: false,
                  error: null,
                });

                try {
                  await get().getUserInfo();

                  const firebaseToken = await pushNotificationService.getToken();
                  if (firebaseToken) {
                    try {
                      await authApiService.updateFirebaseToken(firebaseToken);
                    } catch (firebaseError) {
                      console.warn('Failed to sync firebase token on app init:', firebaseError);
                    }
                  }
                } catch (error) {
                  console.warn('Failed to refresh user info on app init:', error);
                }
              } else if (!get().token) {
                set({
                  isAuthenticated: false,
                  token: null,
                  userInfo: null,
                  isLoading: false,
                  error: null,
                });
              }
            } catch (error) {
              console.error('Error initializing auth:', error);
              if (!get().token) {
                set({
                  isAuthenticated: false,
                  token: null,
                  userInfo: null,
                  isLoading: false,
                  error: null,
                });
              }
            } finally {
              set({ isInitialized: true, isLoading: false });
            }
          })();
        }

        return initializePromise;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the essential auth state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
);

export default useAuthStore;
