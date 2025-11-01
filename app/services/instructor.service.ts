/**
 * Instructor Service
 *
 * Handles instructor-specific API calls
 * All endpoints require authentication and Instructor role
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import {
  StudentSummaryDto,
  ConnectStudentDto,
  UserDto,
  InstructorStatistics,
} from '../types/api.types';

export class InstructorService {
  /**
   * Get all students connected to the current instructor
   * Requires authentication and Instructor role
   */
  static async getStudents(): Promise<StudentSummaryDto[]> {
    try {
      const response = await apiClient.get<StudentSummaryDto[]>(
        API_ENDPOINTS.INSTRUCTORS.GET_STUDENTS
      );
      return response;
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific student
   * Requires authentication and Instructor role
   */
  static async getStudentDetails(studentId: number): Promise<UserDto> {
    try {
      const response = await apiClient.get<UserDto>(
        API_ENDPOINTS.INSTRUCTORS.GET_STUDENT_DETAILS(studentId)
      );
      return response;
    } catch (error) {
      console.error('Get student details error:', error);
      throw error;
    }
  }

  /**
   * Connect with a student by email or ID
   * Requires authentication and Instructor role
   * @param data - Student email or ID
   */
  static async connectWithStudent(data: ConnectStudentDto): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.INSTRUCTORS.CONNECT_WITH_STUDENT,
        data
      );
      return response;
    } catch (error) {
      console.error('Connect with student error:', error);
      throw error;
    }
  }

  /**
   * Remove a student from the instructor's list
   * Requires authentication and Instructor role
   */
  static async removeStudent(studentId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        API_ENDPOINTS.INSTRUCTORS.REMOVE_STUDENT(studentId)
      );
      return response;
    } catch (error) {
      console.error('Remove student error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive statistics for the instructor's dashboard
   * Requires authentication and Instructor role
   * @returns Dashboard statistics including students, workouts, completion rates, and trends
   */
  static async getStatistics(): Promise<InstructorStatistics> {
    try {
      const response = await apiClient.get<InstructorStatistics>(
        API_ENDPOINTS.INSTRUCTORS.GET_STATISTICS
      );
      return response;
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }
}

export default InstructorService;
