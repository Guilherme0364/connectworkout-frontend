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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Get student details error:', error);
      throw error;
    }
  }

  /**
   * Connect with a student
   * Requires authentication and Instructor role
   */
  static async connectWithStudent(studentId: number): Promise<{ message: string }> {
    try {
      const data: ConnectStudentDto = { studentId };
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.INSTRUCTORS.CONNECT_WITH_STUDENT,
        data
      );
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Remove student error:', error);
      throw error;
    }
  }
}

export default InstructorService;
