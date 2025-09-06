import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'student' | 'instructor';

export interface AuthState {
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setCredentials: (token: string, role: UserRole) => Promise<void>;
  checkAuthState: () => Promise<void>;
  clearDevStorage: () => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CREDENTIALS'; payload: { token: string; role: UserRole } }
  | { type: 'CLEAR_CREDENTIALS' }
  | { type: 'RESTORE_CREDENTIALS'; payload: { token: string; role: UserRole } };

const initialState: AuthState = {
  token: null,
  role: null,
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
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_CREDENTIALS':
      return {
        ...state,
        token: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'RESTORE_CREDENTIALS':
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
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
} as const;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const storeCredentials = async (token: string, role: UserRole) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.ROLE, role],
      ]);
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw error;
    }
  };

  const removeCredentials = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.ROLE]);
    } catch (error) {
      console.error('Failed to remove credentials:', error);
      throw error;
    }
  };

  const getStoredCredentials = async (): Promise<{ token: string; role: UserRole } | null> => {
    try {
      const [[, token], [, role]] = await AsyncStorage.multiGet([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.ROLE,
      ]);

      if (token && role && (role === 'student' || role === 'instructor')) {
        return { token, role };
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored credentials:', error);
      return null;
    }
  };

  const login = async (token: string, role: UserRole) => {
    try {
      await storeCredentials(token, role);
      dispatch({ type: 'SET_CREDENTIALS', payload: { token, role } });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeCredentials();
      dispatch({ type: 'CLEAR_CREDENTIALS' });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const setCredentials = async (token: string, role: UserRole) => {
    try {
      await storeCredentials(token, role);
      dispatch({ type: 'SET_CREDENTIALS', payload: { token, role } });
    } catch (error) {
      console.error('Set credentials failed:', error);
      throw error;
    }
  };

  const clearDevStorage = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.ROLE]);
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
      
      // FORCE CLEAR FOR DEBUGGING - Remove cached authentication
      if (credentials) {
        console.log('Found cached credentials, clearing them:', credentials);
        await removeCredentials(); // Clear stored credentials
      }
      
      // Always start with cleared credentials until proper login
      dispatch({ type: 'CLEAR_CREDENTIALS' });
      console.log('Authentication state cleared - user must login');
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