/**
 * User Service
 *
 * Handles user-related API calls
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import {
  UserDto,
  UpdateUserDto,
  UserSearchResponse,
} from '../types/api.types';

export class UserService {
  /**
   * Get current user profile
   * Requires authentication
   */
  static async getProfile(): Promise<UserDto> {
    try {
      const response = await apiClient.get<UserDto>(
        API_ENDPOINTS.USERS.PROFILE
      );
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update current user profile
   * Requires authentication
   */
  static async updateProfile(data: UpdateUserDto): Promise<UserDto> {
    try {
      const response = await apiClient.put<UserDto>(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        data
      );
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Search users by query
   * Requires authentication
   *
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 10)
   */
  static async searchUsers(
    query: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<UserDto[]> {
    try {
      const response = await apiClient.get<UserDto[]>(
        API_ENDPOINTS.USERS.SEARCH,
        {
          params: {
            query,
            page,
            pageSize,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * Requires authentication
   */
  static async getUserById(id: number): Promise<UserDto> {
    try {
      const response = await apiClient.get<UserDto>(
        API_ENDPOINTS.USERS.GET_BY_ID(id)
      );
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Delete student account
   * Permanently deletes the authenticated student's account and all associated data
   * Requires authentication (Student role)
   * Returns 204 No Content on success
   */
  static async deleteStudentAccount(): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.STUDENTS.DELETE_ACCOUNT);
    } catch (error) {
      console.error('Delete student account error:', error);
      throw error;
    }
  }

  /**
   * Delete instructor account
   * Permanently deletes the authenticated instructor's account and all associated data
   * Requires authentication (Instructor role)
   * Returns 204 No Content on success
   */
  static async deleteInstructorAccount(): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.INSTRUCTORS.DELETE_ACCOUNT);
    } catch (error) {
      console.error('Delete instructor account error:', error);
      throw error;
    }
  }
}

export default UserService;
