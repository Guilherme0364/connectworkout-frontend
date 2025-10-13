/**
 * Auth Service
 *
 * Handles authentication-related API calls
 */

import apiClient, { setAuthToken, setRefreshToken, clearTokens } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import {
  LoginDto,
  RegisterUserDto,
  AuthResultDto,
} from '../types/api.types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterUserDto): Promise<AuthResultDto> {
    try {
      console.log('📝 AuthService.register called with:', {
        name: data.name,
        email: data.email,
        userType: data.userType,
        endpoint: API_ENDPOINTS.AUTH.REGISTER
      });

      const response = await apiClient.post<AuthResultDto>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      console.log('✅ Registration response received:', response.data);

      // Store tokens if registration is successful
      if (response.data.success && response.data.accessToken) {
        await setAuthToken(response.data.accessToken);
        if (response.data.refreshToken) {
          await setRefreshToken(response.data.refreshToken);
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        code: error?.code
      });
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginDto): Promise<AuthResultDto> {
    try {
      const response = await apiClient.post<AuthResultDto>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

      // Store tokens if login is successful
      if (response.data.success && response.data.accessToken) {
        await setAuthToken(response.data.accessToken);
        if (response.data.refreshToken) {
          await setRefreshToken(response.data.refreshToken);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Clear stored tokens
      await clearTokens();

      // If backend has a logout endpoint, call it here
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default AuthService;
