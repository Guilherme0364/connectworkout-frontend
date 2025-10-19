/**
 * Workout Service
 *
 * Handles workout-related API calls for both coaches and students
 * All endpoints require authentication
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  Workout,
  WorkoutSummary,
  CreateWorkoutRequest,
  AddWorkoutDayRequest,
  AddExerciseRequest,
  UpdateExerciseRequest,
} from '../types/api.types';

export class WorkoutService {
  // ============================================================================
  // COACH - Workout CRUD
  // ============================================================================

  /**
   * Get all workouts for a specific student
   * Requires authentication and Instructor role
   */
  static async getStudentWorkouts(studentId: number): Promise<WorkoutSummary[]> {
    try {
      const response = await apiClient.get<WorkoutSummary[]>(
        API_ENDPOINTS.WORKOUTS.GET_STUDENT_WORKOUTS(studentId)
      );
      return response;
    } catch (error) {
      console.error('Get student workouts error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific workout
   * Requires authentication and Instructor role
   */
  static async getWorkoutDetails(workoutId: number): Promise<Workout> {
    try {
      const response = await apiClient.get<Workout>(
        API_ENDPOINTS.WORKOUTS.GET_WORKOUT_DETAILS(workoutId)
      );
      return response;
    } catch (error) {
      console.error('Get workout details error:', error);
      throw error;
    }
  }

  /**
   * Create a new workout for a student
   * Requires authentication and Instructor role
   */
  static async createWorkout(
    data: CreateWorkoutRequest
  ): Promise<{ id: number; name: string }> {
    try {
      const response = await apiClient.post<{ id: number; name: string }>(
        API_ENDPOINTS.WORKOUTS.CREATE_WORKOUT,
        data
      );
      return response;
    } catch (error) {
      console.error('Create workout error:', error);
      throw error;
    }
  }

  /**
   * Update a workout's name or active status
   * Requires authentication and Instructor role
   */
  static async updateWorkout(
    workoutId: number,
    data: { name?: string; isActive?: boolean }
  ): Promise<void> {
    try {
      await apiClient.put(API_ENDPOINTS.WORKOUTS.UPDATE_WORKOUT(workoutId), data);
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    }
  }

  /**
   * Delete a workout
   * Requires authentication and Instructor role
   */
  static async deleteWorkout(workoutId: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.WORKOUTS.DELETE_WORKOUT(workoutId));
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    }
  }

  // ============================================================================
  // COACH - Workout Day Management
  // ============================================================================

  /**
   * Add a new day to a workout
   * Requires authentication and Instructor role
   */
  static async addWorkoutDay(
    workoutId: number,
    data: AddWorkoutDayRequest
  ): Promise<void> {
    try {
      await apiClient.post(
        API_ENDPOINTS.WORKOUTS.ADD_WORKOUT_DAY(workoutId),
        data
      );
    } catch (error) {
      console.error('Add workout day error:', error);
      throw error;
    }
  }

  /**
   * Delete a day from a workout
   * Requires authentication and Instructor role
   */
  static async deleteWorkoutDay(workoutId: number, dayId: number): Promise<void> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.WORKOUTS.DELETE_WORKOUT_DAY(workoutId, dayId)
      );
    } catch (error) {
      console.error('Delete workout day error:', error);
      throw error;
    }
  }

  // ============================================================================
  // COACH - Exercise Management
  // ============================================================================

  /**
   * Add an exercise to a workout day
   * Requires authentication and Instructor role
   */
  static async addExercise(
    workoutId: number,
    dayId: number,
    data: AddExerciseRequest
  ): Promise<void> {
    try {
      await apiClient.post(
        API_ENDPOINTS.WORKOUTS.ADD_EXERCISE(workoutId, dayId),
        data
      );
    } catch (error) {
      console.error('Add exercise error:', error);
      throw error;
    }
  }

  /**
   * Update an exercise's configuration
   * Requires authentication and Instructor role
   */
  static async updateExercise(
    workoutId: number,
    dayId: number,
    exerciseId: number,
    data: UpdateExerciseRequest
  ): Promise<void> {
    try {
      await apiClient.put(
        API_ENDPOINTS.WORKOUTS.UPDATE_EXERCISE(workoutId, dayId, exerciseId),
        data
      );
    } catch (error) {
      console.error('Update exercise error:', error);
      throw error;
    }
  }

  /**
   * Delete an exercise from a workout day
   * Requires authentication and Instructor role
   */
  static async deleteExercise(
    workoutId: number,
    dayId: number,
    exerciseId: number
  ): Promise<void> {
    try {
      await apiClient.delete(
        API_ENDPOINTS.WORKOUTS.DELETE_EXERCISE(workoutId, dayId, exerciseId)
      );
    } catch (error) {
      console.error('Delete exercise error:', error);
      throw error;
    }
  }

  /**
   * Reorder exercises in a workout day
   * Requires authentication and Instructor role
   */
  static async reorderExercises(
    workoutId: number,
    dayId: number,
    exerciseIds: number[]
  ): Promise<void> {
    try {
      await apiClient.put(
        API_ENDPOINTS.WORKOUTS.REORDER_EXERCISES(workoutId, dayId),
        { exerciseIds }
      );
    } catch (error) {
      console.error('Reorder exercises error:', error);
      throw error;
    }
  }

  // ============================================================================
  // STUDENT - View Workouts
  // ============================================================================

  /**
   * Get all workouts for the current student
   * Requires authentication and Student role
   */
  static async getMyWorkouts(): Promise<WorkoutSummary[]> {
    try {
      const response = await apiClient.get<WorkoutSummary[]>(
        API_ENDPOINTS.WORKOUTS.GET_MY_WORKOUTS
      );
      return response;
    } catch (error) {
      console.error('Get my workouts error:', error);
      throw error;
    }
  }

  /**
   * Get the active workout for the current student
   * Requires authentication and Student role
   */
  static async getMyActiveWorkout(): Promise<Workout> {
    try {
      const response = await apiClient.get<Workout>(
        API_ENDPOINTS.WORKOUTS.GET_MY_ACTIVE_WORKOUT
      );
      return response;
    } catch (error) {
      console.error('Get my active workout error:', error);
      throw error;
    }
  }
}

export default WorkoutService;
