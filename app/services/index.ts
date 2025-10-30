/**
 * Services Index
 *
 * Central export point for all API services
 */

export { default as apiClient, setAuthToken, setRefreshToken, clearTokens, getToken } from './api.client';
export { default as AuthService } from './auth.service';
export { default as UserService } from './user.service';
export { default as InstructorService } from './instructor.service';
export { default as StudentService } from './student.service';
export { default as ExerciseService } from './exercise.service';
export { default as WorkoutService } from './workout.service';
export { default as ExerciseImageService, RESOLUTION } from './exerciseImage.service';
