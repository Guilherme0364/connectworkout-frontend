/**
 * API Client
 *
 * Axios instance configured with interceptors for authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';
import { ApiError } from '../types/api.types';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@connectworkout:token',
  REFRESH_TOKEN: '@connectworkout:refreshToken',
} as const;

/**
 * Create axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  // Force axios to use XMLHttpRequest adapter for web compatibility
  adapter: 'xhr',
});

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('🚀 Making request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data
      });

      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (storageError) {
        // AsyncStorage errors shouldn't block the request
        console.warn('AsyncStorage error (non-blocking):', storageError);
      }

      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    // Return successful response
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Check if we've already tried to refresh
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          if (refreshToken) {
            // Note: Implement token refresh logic here when backend supports it
            // For now, we'll just clear the tokens and redirect to login
            await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);

            // You can emit an event here to notify the app to redirect to login
            // or use a navigation service
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens
          await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
        }
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Transform error to our ApiError format
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

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
