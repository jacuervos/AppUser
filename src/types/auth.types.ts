// Types for API responses
export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    rol: string;
  };
  message: string;
}

export interface UserInfo {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string | null;
  identification: string;
  photo: string | null;
  points: number;
  rol: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
    color: string;
  };
}

export interface UserInfoResponse {
  success: boolean;
  data: UserInfo;
  message: string;
}

// Types for login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  firebase_token?: string | null;
}

// Types for password reset
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ValidateTokenRequest {
  email: string;
  token: string;
}

export interface ValidateTokenResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Type for auth state
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}


// Types for register credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  phone: string;
  identification: string;
  type_identification: number;
  images: string;
}

// Types for API responses
export interface RegisterResponse {
  code: number;
  message: string;
}

// Types for register credentials
export interface UpdateCredentials {
  email: string;
  name: string;
  phone: string;
  images: string;
  identification: string;
}

// Types for API responses
export interface UserUpdateResponse {
  code: number;
  message: string;
  user: UserInfo;
}