/**
 * API Configuration
 *
 * Easy-to-configure API settings for your backend server.
 * Automatically detects the correct host based on the platform.
 */

import { Platform } from 'react-native';

// ========================================
// 🔧 CONFIGURATION - Update these values
// ========================================

const API_PORT = 7009;           // Change to your backend port
const API_PROTOCOL = 'http';     // Use 'https' for production

// For physical devices, set your computer's local IP address here
// Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_NETWORK_IP = '192.168.1.100'; // CHANGE THIS to your computer's IP

// ========================================
// 📱 Platform-specific host configuration
// ========================================
// Automatically detects the correct host:
// - iOS Simulator: uses 'localhost'
// - Android Emulator: uses '10.0.2.2' (Android's special alias for host machine)
// - Physical device: uses LOCAL_NETWORK_IP (you must set this above)

const getApiHost = (): string => {
  // Check if running on a physical device
  // In development, __DEV__ is true
  if (__DEV__) {
    if (Platform.OS === 'web') {
      // Web (Expo Web): use localhost since we're in a browser
      return 'localhost';
    } else if (Platform.OS === 'android') {
      // Android Emulator: use 10.0.2.2 to reach host machine
      // Physical Android device: use local network IP
      // You can detect emulator vs device, but for simplicity, try 10.0.2.2 first
      return '10.0.2.2';
    } else if (Platform.OS === 'ios') {
      // iOS Simulator can use localhost
      return 'localhost';
    }
  }

  // Fallback for production or unknown platforms
  return 'localhost';
};

const API_HOST = getApiHost();

// ========================================

const BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;

// Log the API URL for debugging
console.log(`🌐 API Base URL: ${BASE_URL} (Platform: ${Platform.OS})`);

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },

  // User endpoints
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    SEARCH: '/api/users/search',
    GET_BY_ID: (id: number) => `/api/users/${id}`,
  },

  // Instructor endpoints
  INSTRUCTORS: {
    GET_STUDENTS: '/api/instructors/students',
    GET_STUDENT_DETAILS: (studentId: number) => `/api/instructors/students/${studentId}`,
    CONNECT_WITH_STUDENT: '/api/instructors/connect',
    REMOVE_STUDENT: (studentId: number) => `/api/instructors/students/${studentId}`,
  },

  // Exercise endpoints
  EXERCISES: {
    SEARCH: '/api/exercises/search',
    GET_BY_ID: (id: string) => `/api/exercises/${id}`,
    GET_BODY_PARTS: '/api/exercises/bodyparts',
    GET_BY_BODY_PART: (bodyPart: string) => `/api/exercises/bodypart/${bodyPart}`,
    GET_TARGETS: '/api/exercises/targets',
    GET_BY_TARGET: (target: string) => `/api/exercises/target/${target}`,
    GET_EQUIPMENTS: '/api/exercises/equipments',
    GET_BY_EQUIPMENT: (equipment: string) => `/api/exercises/equipment/${equipment}`,
  },
} as const;
