/**
 * API Client using native fetch API
 *
 * Simple and efficient HTTP client that works across all platforms
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { API_CONFIG } from '../config/api.config';
import { ApiError } from '../types/api.types';
import { globalLogout } from '../utils/globalLogout';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@connectworkout:token',
  REFRESH_TOKEN: '@connectworkout:refreshToken',
} as const;

/**
 * Helper function to get auth token
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Make an HTTP request using fetch
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    // Get auth token
    const token = await getAuthToken();

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response body
    let data: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle errors
    if (!response.ok) {
      // Special handling for 401 Unauthorized (session expired)
      if (response.status === 401) {
        console.warn('Session expired');

        // Call global logout to clear everything and redirect
        // This happens directly without going through React state
        globalLogout('401 Session Expired').catch((err) => {
          console.error('Error during 401 logout:', err);
        });

        // Throw error to stop execution of the current request
        const error: ApiError = {
          message: 'Session expired',
          status: 401,
        };
        throw error;
      }

      // Handle other errors normally
      const error: ApiError = {
        message: data?.message || response.statusText || 'Request failed',
        status: response.status,
        errors: data?.errors,
      };

      console.error('Request failed:', error.message);
      throw error;
    }

    // Unwrap ApiResponse<T> structure if present
    // Backend may return { data: T, message: string } wrapper
    if (data && typeof data === 'object' && 'data' in data && !Array.isArray(data)) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    console.error('Request error:', error.message);

    // If it's already an ApiError, rethrow it
    if (error.status !== undefined) {
      throw error;
    }

    // Otherwise, create a new ApiError
    const apiError: ApiError = {
      message: error.message || 'Network request failed',
      status: undefined,
    };
    throw apiError;
  }
}

/**
 * HTTP methods
 */
export const apiClient = {
  get: <T = any>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, data?: any, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};

/**
 * Helper function to set the auth token
 */
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

/**
 * Helper function to set the refresh token
 */
export const setRefreshToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
};

/**
 * Helper function to clear tokens
 */
export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Helper function to get the current token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export default apiClient;
