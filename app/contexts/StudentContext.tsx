/**
 * Student Context
 *
 * Manages student-specific state including trainer connection status,
 * pending trainer requests, and student profile information.
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { StudentService } from '../services';
import {
  StudentProfileDto,
  TrainerRequestDto,
  TrainerDto,
  UpdateStudentProfileDto,
  StudentDashboardDto,
  InvitationDto,
} from '../types/api.types';

// ============================================================================
// Types
// ============================================================================

export interface StudentState {
  profile: StudentProfileDto | null;
  currentTrainer: TrainerDto | null;
  trainerRequests: TrainerRequestDto[]; // Legacy
  pendingInvitations: InvitationDto[]; // New invitation workflow
  dashboardData: StudentDashboardDto | null;
  hasTrainer: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface StudentContextType extends StudentState {
  loadProfile: () => Promise<void>;
  updateProfile: (data: UpdateStudentProfileDto) => Promise<void>;
  loadTrainerRequests: () => Promise<void>; // Legacy
  loadPendingInvitations: () => Promise<void>; // New invitation workflow
  loadCurrentTrainer: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  acceptTrainer: (trainerId: number) => Promise<void>; // Legacy
  acceptInvitation: (invitationId: number) => Promise<void>; // New invitation workflow
  rejectTrainer: (trainerId: number) => Promise<void>; // Legacy
  rejectInvitation: (invitationId: number) => Promise<void>; // New invitation workflow
  disconnectTrainer: () => Promise<void>;
  refreshStudentData: () => Promise<void>;
}

type StudentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: StudentProfileDto }
  | { type: 'SET_CURRENT_TRAINER'; payload: TrainerDto | null }
  | { type: 'SET_TRAINER_REQUESTS'; payload: TrainerRequestDto[] }
  | { type: 'SET_PENDING_INVITATIONS'; payload: InvitationDto[] }
  | { type: 'SET_DASHBOARD_DATA'; payload: StudentDashboardDto }
  | { type: 'CLEAR_DATA' };

// ============================================================================
// Initial State & Reducer
// ============================================================================

const initialState: StudentState = {
  profile: null,
  currentTrainer: null,
  trainerRequests: [],
  pendingInvitations: [],
  dashboardData: null,
  hasTrainer: false,
  isLoading: true,
  error: null,
};

function studentReducer(state: StudentState, action: StudentAction): StudentState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        hasTrainer: action.payload.hasTrainer,
        isLoading: false,
        error: null,
      };
    case 'SET_CURRENT_TRAINER':
      return {
        ...state,
        currentTrainer: action.payload,
        hasTrainer: action.payload !== null,
        isLoading: false,
      };
    case 'SET_TRAINER_REQUESTS':
      return {
        ...state,
        trainerRequests: action.payload,
        isLoading: false,
      };
    case 'SET_PENDING_INVITATIONS':
      console.log('[StudentContext Reducer] SET_PENDING_INVITATIONS called with:', action.payload.length, 'invitations');
      console.log('[StudentContext Reducer] Invitation data:', JSON.stringify(action.payload, null, 2));
      return {
        ...state,
        pendingInvitations: action.payload,
        isLoading: false,
      };
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload,
        hasTrainer: action.payload.hasTrainer,
        currentTrainer: action.payload.currentTrainer,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const StudentContext = createContext<StudentContextType | undefined>(undefined);

interface StudentProviderProps {
  children: ReactNode;
}

export function StudentProvider({ children }: StudentProviderProps) {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // ============================================================================
  // API Methods
  // ============================================================================

  const loadProfile = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const profile = await StudentService.getProfile();
      dispatch({ type: 'SET_PROFILE', payload: profile });
    } catch (error: any) {
      console.error('Failed to load student profile:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load profile' });
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateStudentProfileDto) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProfile = await StudentService.updateProfile(data);
      dispatch({ type: 'SET_PROFILE', payload: updatedProfile });
    } catch (error: any) {
      console.error('Failed to update student profile:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update profile' });
      throw error;
    }
  }, []);

  const loadTrainerRequests = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const requests = await StudentService.getTrainerRequests();
      dispatch({ type: 'SET_TRAINER_REQUESTS', payload: requests });
    } catch (error: any) {
      console.error('Failed to load trainer requests:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load trainer requests' });
    }
  }, []);

  const loadPendingInvitations = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const invitations = await StudentService.getPendingInvitations();
      console.log('[StudentContext] Invitations received from service:', JSON.stringify(invitations, null, 2));
      console.log('[StudentContext] Dispatching SET_PENDING_INVITATIONS with', invitations.length, 'invitations');
      dispatch({ type: 'SET_PENDING_INVITATIONS', payload: invitations });
    } catch (error: any) {
      console.error('Failed to load pending invitations:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load pending invitations' });
    }
  }, []);

  const loadCurrentTrainer = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const trainer = await StudentService.getCurrentTrainer();
      dispatch({ type: 'SET_CURRENT_TRAINER', payload: trainer });
    } catch (error: any) {
      console.error('Failed to load current trainer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load trainer' });
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const dashboardData = await StudentService.getDashboard();
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load dashboard' });
    }
  }, []);

  const acceptTrainer = useCallback(async (trainerId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await StudentService.acceptTrainer(trainerId);

      // Refresh data after accepting trainer
      await Promise.all([
        loadProfile(),
        loadCurrentTrainer(),
        loadTrainerRequests(),
      ]);
    } catch (error: any) {
      console.error('Failed to accept trainer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to accept trainer' });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptInvitation = useCallback(async (invitationId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      console.log('[StudentContext] Accepting invitation:', invitationId);
      const response = await StudentService.acceptInvitation(invitationId);
      console.log('[StudentContext] Invitation accepted, response:', response);

      // Refresh all student data to ensure everything is synced
      // loadDashboard includes trainer and profile data
      console.log('[StudentContext] Refreshing student data after acceptance...');
      await Promise.all([
        loadDashboard(),
        loadPendingInvitations(),
      ]);

      console.log('[StudentContext] Student data refreshed successfully');
    } catch (error: any) {
      console.error('[StudentContext] Failed to accept invitation:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to accept invitation' });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rejectTrainer = useCallback(async (trainerId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await StudentService.rejectTrainer(trainerId);

      // Refresh trainer requests after rejection
      await loadTrainerRequests();
    } catch (error: any) {
      console.error('Failed to reject trainer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to reject trainer' });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rejectInvitation = useCallback(async (invitationId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      console.log('[StudentContext] Rejecting invitation:', invitationId);
      await StudentService.rejectInvitation(invitationId);
      console.log('[StudentContext] Invitation rejected successfully');

      // Refresh pending invitations after rejection
      console.log('[StudentContext] Refreshing pending invitations...');
      await loadPendingInvitations();
      console.log('[StudentContext] Pending invitations refreshed');
    } catch (error: any) {
      console.error('[StudentContext] Failed to reject invitation:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to reject invitation' });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnectTrainer = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await StudentService.disconnectTrainer();

      // Clear trainer data
      dispatch({ type: 'SET_CURRENT_TRAINER', payload: null });
      await loadProfile();
    } catch (error: any) {
      console.error('Failed to disconnect trainer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to disconnect trainer' });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshStudentData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Use the new dashboard endpoint which consolidates the data
      await loadDashboard();
      // Load pending invitations (new invitation workflow)
      await loadPendingInvitations();
    } catch (error: any) {
      console.error('Failed to refresh student data:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to refresh data' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: StudentContextType = useMemo(
    () => ({
      ...state,
      loadProfile,
      updateProfile,
      loadTrainerRequests,
      loadPendingInvitations,
      loadCurrentTrainer,
      loadDashboard,
      acceptTrainer,
      acceptInvitation,
      rejectTrainer,
      rejectInvitation,
      disconnectTrainer,
      refreshStudentData,
    }),
    [
      state,
      loadProfile,
      updateProfile,
      loadTrainerRequests,
      loadPendingInvitations,
      loadCurrentTrainer,
      loadDashboard,
      acceptTrainer,
      acceptInvitation,
      rejectTrainer,
      rejectInvitation,
      disconnectTrainer,
      refreshStudentData,
    ]
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useStudent(): StudentContextType {
  const context = useContext(StudentContext);
  if (context === undefined) {
    // Return a safe default state when not wrapped in provider
    // This prevents errors during initial app load or for non-student users
    return {
      profile: null,
      currentTrainer: null,
      trainerRequests: [],
      pendingInvitations: [],
      dashboardData: null,
      hasTrainer: false,
      isLoading: false,
      error: null,
      loadProfile: async () => {},
      updateProfile: async () => {},
      loadTrainerRequests: async () => {},
      loadPendingInvitations: async () => {},
      loadCurrentTrainer: async () => {},
      loadDashboard: async () => {},
      acceptTrainer: async () => {},
      acceptInvitation: async () => {},
      rejectTrainer: async () => {},
      rejectInvitation: async () => {},
      disconnectTrainer: async () => {},
      refreshStudentData: async () => {},
    };
  }
  return context;
}

export default StudentContext;
