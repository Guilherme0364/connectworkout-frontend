import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, setAuthToken, setRefreshToken, clearTokens } from '../services';
import { LoginDto, RegisterUserDto, UserDto, UserType } from '../types/api.types';

export type UserRole = 'student' | 'instructor';

export interface AuthState {
  token: string | null;
  role: UserRole | null;
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterUserDto) => Promise<void>;
  logout: () => Promise<void>;
  setCredentials: (token: string, role: UserRole, user: UserDto) => Promise<void>;
  checkAuthState: () => Promise<void>;
  clearDevStorage: () => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CREDENTIALS'; payload: { token: string; role: UserRole; user: UserDto } }
  | { type: 'CLEAR_CREDENTIALS' }
  | { type: 'RESTORE_CREDENTIALS'; payload: { token: string; role: UserRole; user: UserDto } };

const initialState: AuthState = {
  token: null,
  role: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CREDENTIALS':
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_CREDENTIALS':
      return {
        ...state,
        token: null,
        role: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'RESTORE_CREDENTIALS':
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: '@connectworkout:token',
  ROLE: '@connectworkout:role',
  USER: '@connectworkout:user',
} as const;

// Helper function to convert UserType enum to UserRole
const mapUserTypeToRole = (userType: UserType): UserRole => {
  return userType === UserType.Instructor ? 'instructor' : 'student';
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const storeCredentials = async (token: string, role: UserRole, user: UserDto) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.ROLE, role],
        [STORAGE_KEYS.USER, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw error;
    }
  };

  const removeCredentials = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.ROLE, STORAGE_KEYS.USER]);
      await clearTokens(); // Also clear tokens from API client
    } catch (error) {
      console.error('Failed to remove credentials:', error);
      throw error;
    }
  };

  const getStoredCredentials = async (): Promise<{ token: string; role: UserRole; user: UserDto } | null> => {
    try {
      const [[, token], [, role], [, userJson]] = await AsyncStorage.multiGet([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.ROLE,
        STORAGE_KEYS.USER,
      ]);

      if (token && role && userJson && (role === 'student' || role === 'instructor')) {
        const user = JSON.parse(userJson) as UserDto;
        return { token, role, user };
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored credentials:', error);
      return null;
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Call the backend API
      const result = await AuthService.login(credentials);

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      // Map UserType to UserRole
      const role = mapUserTypeToRole(result.user.userType);

      // Store credentials
      await storeCredentials(result.accessToken, role, result.user);

      // Update state
      dispatch({
        type: 'SET_CREDENTIALS',
        payload: {
          token: result.accessToken,
          role,
          user: result.user
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (data: RegisterUserDto) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Call the backend API
      const result = await AuthService.register(data);

      if (!result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      // Map UserType to UserRole
      const role = mapUserTypeToRole(result.user.userType);

      // Store credentials
      await storeCredentials(result.accessToken, role, result.user);

      // Update state
      dispatch({
        type: 'SET_CREDENTIALS',
        payload: {
          token: result.accessToken,
          role,
          user: result.user
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      await removeCredentials();
      dispatch({ type: 'CLEAR_CREDENTIALS' });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const setCredentials = async (token: string, role: UserRole, user: UserDto) => {
    try {
      await storeCredentials(token, role, user);
      dispatch({ type: 'SET_CREDENTIALS', payload: { token, role, user } });
    } catch (error) {
      console.error('Set credentials failed:', error);
      throw error;
    }
  };

  const clearDevStorage = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.ROLE, STORAGE_KEYS.USER]);
      await clearTokens();
      dispatch({ type: 'CLEAR_CREDENTIALS' });
      console.log('Development storage cleared successfully');
    } catch (error) {
      console.error('Failed to clear development storage:', error);
    }
  };

  const checkAuthState = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const credentials = await getStoredCredentials();

      if (credentials) {
        // Restore credentials from storage
        dispatch({
          type: 'RESTORE_CREDENTIALS',
          payload: {
            token: credentials.token,
            role: credentials.role,
            user: credentials.user
          }
        });
      } else {
        // No credentials found
        dispatch({ type: 'CLEAR_CREDENTIALS' });
      }
    } catch (error) {
      console.error('Failed to check auth state:', error);
      dispatch({ type: 'CLEAR_CREDENTIALS' });
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    setCredentials,
    checkAuthState,
    clearDevStorage,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}