/**
 * API Type Definitions
 * These types match the backend DTOs from ConnectWorkout.Core
 */

// ============================================================================
// Enums
// ============================================================================

export enum UserType {
  Instructor = 1,
  Student = 2,
}

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

// ============================================================================
// Auth DTOs
// ============================================================================

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: Gender;
  userType: UserType;
  description?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResultDto {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  userType: UserType;
  description: string;
}

export interface UpdateUserDto {
  name?: string;
  age?: number;
  gender?: Gender;
  description?: string;
  currentPassword?: string;
  newPassword?: string;
}

// ============================================================================
// Instructor DTOs
// ============================================================================

export interface ConnectStudentDto {
  studentId: number;
}

export interface StudentSummaryDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  activeWorkoutId: number;
  activeWorkoutName: string;
  completedExercisesToday: number;
  totalExercisesToday: number;
}

// ============================================================================
// Exercise DTOs
// ============================================================================

export interface ExerciseDbModel {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// ============================================================================
// User Search Response
// ============================================================================

export interface UserSearchResponse {
  users: UserDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// Generic API Response
// ============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
