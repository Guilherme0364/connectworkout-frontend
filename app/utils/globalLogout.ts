/**
 * Global Logout Utility
 *
 * Provides a centralized logout function that can be called from anywhere
 * in the app (including API client) without going through React state.
 *
 * This prevents infinite loops when handling 401 errors.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@connectworkout:token',
  REFRESH_TOKEN: '@connectworkout:refreshToken',
  ROLE: '@connectworkout:role',
  USER: '@connectworkout:user',
} as const;

// Flag to prevent multiple simultaneous logout calls
let isLoggingOut = false;

// Last logout timestamp to prevent rapid successive calls
let lastLogoutTimestamp = 0;
const LOGOUT_COOLDOWN_MS = 2000; // 2 seconds cooldown

// Store router reference (will be set by root component)
let routerInstance: any = null;

// Store auth dispatch reference (will be set by AuthContext)
let authDispatch: React.Dispatch<any> | null = null;

/**
 * Set the router instance for navigation
 * Should be called once from the root _layout.tsx
 */
export function setRouter(router: any) {
  routerInstance = router;
}

/**
 * Set the auth dispatch function
 * Should be called once from AuthContext provider
 * This allows globalLogout to clear React state without circular dependencies
 */
export function setAuthDispatch(dispatch: React.Dispatch<any> | null) {
  authDispatch = dispatch;
}

/**
 * Global logout function
 * - Clears all auth data from AsyncStorage
 * - Navigates to login screen
 * - Works on web and React Native
 * - Prevents multiple simultaneous calls
 */
export async function globalLogout(reason: string = 'Manual logout') {
  // Prevent multiple simultaneous logout calls
  if (isLoggingOut) {
    console.log('⚠️ Logout already in progress, skipping...');
    return;
  }

  // Prevent rapid successive logout calls
  const now = Date.now();
  if (now - lastLogoutTimestamp < LOGOUT_COOLDOWN_MS) {
    console.log('⚠️ Logout called too soon after last logout, skipping...');
    return;
  }

  try {
    isLoggingOut = true;
    lastLogoutTimestamp = now;
    console.log('🔴 Global Logout:', reason);

    // STEP 1: Clear AuthContext React state FIRST
    // This prevents race conditions where the old state persists
    if (authDispatch) {
      console.log('🧹 Clearing AuthContext state...');
      authDispatch({ type: 'CLEAR_CREDENTIALS' });
      console.log('✅ AuthContext state cleared');
    } else {
      console.warn('⚠️ AuthContext dispatch not available - state may not be cleared');
    }

    // STEP 2: Clear all auth data from AsyncStorage
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.ROLE,
      STORAGE_KEYS.USER,
    ]);

    console.log('✅ Auth data cleared from storage');

    // Navigate to login screen
    if (routerInstance) {
      console.log('🔄 Navigating to login...');

      // Use replace to prevent back navigation
      if (Platform.OS === 'web') {
        // For web, we can use window.location as fallback
        routerInstance.replace('/(auth)/sign-in');
      } else {
        // For native, expo-router works directly
        routerInstance.replace('/(auth)/sign-in');
      }
    } else {
      console.warn('⚠️ Router not available, redirecting via window.location');
      // Fallback for web if router isn't set
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    console.log('✅ Logout complete');
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Even if there's an error, try to navigate to login
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = '/sign-in';
    }
  } finally {
    // Reset flag after a delay to allow navigation to complete
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
}

/**
 * Check if a logout is currently in progress
 */
export function isLogoutInProgress(): boolean {
  return isLoggingOut;
}
