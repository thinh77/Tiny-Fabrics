import { api } from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

const TOKEN_KEY = 'tiny_fabrics_token';
const USER_KEY = 'tiny_fabrics_user';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Đăng nhập thất bại');
    }
    
    // Store token and user
    this.setToken(response.data.token);
    this.setUser(response.data.user);
    
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Đăng ký thất bại');
    }
    
    // Store token and user
    this.setToken(response.data.token);
    this.setUser(response.data.user);
    
    return response.data;
  },

  // Get current user from API
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Không thể lấy thông tin người dùng');
    }
    return response.data;
  },

  // Update profile
  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Cập nhật thông tin thất bại');
    }
    
    // Update stored user
    this.setUser(response.data);
    
    return response.data;
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await api.put<ApiResponse<null>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    if (!response.success) {
      throw new Error(response.error || 'Đổi mật khẩu thất bại');
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Token management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // User management
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Check if logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  },
};
