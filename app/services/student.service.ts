/**
 * Student Service
 *
 * Handles all student-specific API operations including:
 * - Student profile management
 * - Trainer connection requests
 * - Trainer acceptance/rejection
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import {
  StudentProfileDto,
  UpdateStudentProfileDto,
  TrainerRequestDto,
  TrainerDto,
  AcceptTrainerDto,
  ApiResponse,
  StudentDashboardDto,
} from '../types/api.types';

class StudentService {
  /**
   * Get the current student's profile
   * @returns Student profile data with trainer status
   */
  async getProfile(): Promise<StudentProfileDto> {
    const response = await apiClient.get<StudentProfileDto>(
      API_ENDPOINTS.STUDENTS.GET_PROFILE
    );
    return response;
  }

  /**
   * Get student dashboard data with trainer info, workout count, and active workout
   * @returns Aggregated dashboard data
   */
  async getDashboard(): Promise<StudentDashboardDto> {
    const response = await apiClient.get<StudentDashboardDto>(
      API_ENDPOINTS.STUDENTS.GET_DASHBOARD
    );
    return response;
  }

  /**
   * Update the current student's profile
   * @param data - Updated student profile data
   * @returns Updated student profile
   */
  async updateProfile(data: UpdateStudentProfileDto): Promise<StudentProfileDto> {
    const response = await apiClient.put<StudentProfileDto>(
      API_ENDPOINTS.STUDENTS.UPDATE_PROFILE,
      data
    );
    return response;
  }

  /**
   * Get all pending trainer connection requests
   * @returns List of trainer requests
   */
  async getTrainerRequests(): Promise<TrainerRequestDto[]> {
    const response = await apiClient.get<TrainerRequestDto[]>(
      API_ENDPOINTS.STUDENTS.GET_TRAINER_REQUESTS
    );
    return response;
  }

  /**
   * Get detailed information about a specific trainer
   * @param trainerId - ID of the trainer to fetch
   * @returns Detailed trainer information
   */
  async getTrainerDetails(trainerId: number): Promise<TrainerDto> {
    const response = await apiClient.get<TrainerDto>(
      API_ENDPOINTS.STUDENTS.GET_TRAINER_DETAILS(trainerId)
    );
    return response;
  }

  /**
   * Get the currently connected trainer (if any)
   * @returns Current trainer information or null
   */
  async getCurrentTrainer(): Promise<TrainerDto | null> {
    try {
      const response = await apiClient.get<TrainerDto>(
        API_ENDPOINTS.STUDENTS.GET_CURRENT_TRAINER
      );
      return response;
    } catch (error: any) {
      // If no trainer is connected, API returns 404
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Accept a trainer connection request
   * @param trainerId - ID of the trainer to accept
   * @returns Success message
   */
  async acceptTrainer(trainerId: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.STUDENTS.ACCEPT_TRAINER(trainerId)
    );
    return response;
  }

  /**
   * Reject a trainer connection request
   * @param trainerId - ID of the trainer to reject
   * @returns Success message
   */
  async rejectTrainer(trainerId: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.STUDENTS.REJECT_TRAINER(trainerId)
    );
    return response;
  }

  /**
   * Disconnect from the current trainer
   * @returns Success message
   */
  async disconnectTrainer(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.STUDENTS.DISCONNECT_TRAINER
    );
    return response;
  }

  /**
   * Upload student profile photo
   * Note: This is a placeholder - actual implementation depends on backend file upload strategy
   * @param photoFile - File to upload
   * @returns URL of uploaded photo
   */
  async uploadPhoto(photoFile: any): Promise<{ photoUrl: string }> {
    // TODO: Implement actual file upload logic based on backend requirements
    // This might use FormData or a different upload strategy
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await apiClient.post<{ photoUrl: string }>(
      '/api/students/upload-photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  }
}

export default new StudentService();
