/**
 * Exercise Service
 *
 * Handles exercise-related API calls
 * All endpoints require authentication
 */

import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import { ExerciseDbModel } from '../types/api.types';

export class ExerciseService {
  /**
   * Search exercises by name
   * Requires authentication
   *
   * @param name - Exercise name to search for
   */
  static async searchExercises(name: string): Promise<ExerciseDbModel[]> {
    try {
      const url = `${API_ENDPOINTS.EXERCISES.SEARCH}?name=${encodeURIComponent(name)}`;
      console.log('📡 Fetching from URL:', url);

      const response = await apiClient.get<{ data: ExerciseDbModel[]; total: number; limit: number; offset: number }>(url);

      console.log('📦 Raw response:', response);
      console.log('📊 Response structure:', {
        hasData: !!response.data,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        total: response.total,
      });

      // Backend returns { data: [...], total: X, limit: Y, offset: Z }
      // We need to extract the data array
      const exercises = response.data || [];
      console.log('✅ Extracted exercises array:', exercises.length, 'items');

      return exercises;
    } catch (error) {
      console.error('Search exercises error:', error);
      throw error;
    }
  }

  /**
   * Get exercise by ID
   * Requires authentication
   */
  static async getExerciseById(id: string): Promise<ExerciseDbModel> {
    try {
      const response = await apiClient.get<ExerciseDbModel>(
        API_ENDPOINTS.EXERCISES.GET_BY_ID(id)
      );
      return response;
    } catch (error) {
      console.error('Get exercise by ID error:', error);
      throw error;
    }
  }

  /**
   * Get list of all body parts
   * Requires authentication
   */
  static async getBodyParts(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        API_ENDPOINTS.EXERCISES.GET_BODY_PARTS
      );
      return response;
    } catch (error) {
      console.error('Get body parts error:', error);
      throw error;
    }
  }

  /**
   * Get exercises by body part
   * Requires authentication
   *
   * @param bodyPart - Body part name (e.g., "back", "chest", "legs")
   */
  static async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseDbModel[]> {
    try {
      const response = await apiClient.get<{ data: ExerciseDbModel[] } | ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_BODY_PART(bodyPart)
      );

      // Handle both wrapped and unwrapped responses
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: ExerciseDbModel[] }).data || [];
      }

      return [];
    } catch (error) {
      console.error('Get exercises by body part error:', error);
      throw error;
    }
  }

  /**
   * Get list of all target muscles
   * Requires authentication
   */
  static async getTargets(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        API_ENDPOINTS.EXERCISES.GET_TARGETS
      );
      return response;
    } catch (error) {
      console.error('Get targets error:', error);
      throw error;
    }
  }

  /**
   * Get exercises by target muscle
   * Requires authentication
   *
   * @param target - Target muscle name
   */
  static async getExercisesByTarget(target: string): Promise<ExerciseDbModel[]> {
    try {
      const response = await apiClient.get<{ data: ExerciseDbModel[] } | ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_TARGET(target)
      );

      // Handle both wrapped and unwrapped responses
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: ExerciseDbModel[] }).data || [];
      }

      return [];
    } catch (error) {
      console.error('Get exercises by target error:', error);
      throw error;
    }
  }

  /**
   * Get list of all equipment types
   * Requires authentication
   */
  static async getEquipments(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        API_ENDPOINTS.EXERCISES.GET_EQUIPMENTS
      );
      return response;
    } catch (error) {
      console.error('Get equipments error:', error);
      throw error;
    }
  }

  /**
   * Get exercises by equipment type
   * Requires authentication
   *
   * @param equipment - Equipment type (e.g., "barbell", "dumbbell", "body weight")
   */
  static async getExercisesByEquipment(equipment: string): Promise<ExerciseDbModel[]> {
    try {
      const response = await apiClient.get<{ data: ExerciseDbModel[] } | ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_EQUIPMENT(equipment)
      );

      // Handle both wrapped and unwrapped responses
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: ExerciseDbModel[] }).data || [];
      }

      return [];
    } catch (error) {
      console.error('Get exercises by equipment error:', error);
      throw error;
    }
  }

  /**
   * Search exercises by name with pagination
   * Requires authentication
   *
   * @param name - Exercise name to search for
   * @param limit - Maximum number of results (default: 30)
   * @param offset - Number of results to skip (default: 0)
   */
  static async searchExercisesWithPagination(
    name: string,
    limit: number = 30,
    offset: number = 0
  ): Promise<import('../types/api.types').ExerciseSearchResponse> {
    try {
      const params = new URLSearchParams({
        name: encodeURIComponent(name),
        limit: limit.toString(),
        offset: offset.toString(),
      });
      const url = `${API_ENDPOINTS.EXERCISES.SEARCH}?${params}`;
      const response = await apiClient.get<import('../types/api.types').ExerciseSearchResponse>(url);

      // Backend already returns ExerciseSearchResponse format
      return response;
    } catch (error) {
      console.error('Search exercises with pagination error:', error);
      throw error;
    }
  }

  /**
   * Filter exercises by multiple criteria with pagination
   * Requires authentication
   *
   * @param filters - Filter criteria (name, bodyPart, equipment, target)
   * @param limit - Maximum number of results (default: 30)
   * @param offset - Number of results to skip (default: 0)
   */
  static async filterExercises(
    filters: {
      name?: string;
      bodyPart?: string;
      equipment?: string;
      target?: string;
    },
    limit: number = 30,
    offset: number = 0
  ): Promise<import('../types/api.types').ExerciseFilterResponse> {
    try {
      const params = new URLSearchParams({
        ...(filters.name && { name: filters.name }),
        ...(filters.bodyPart && { bodyPart: filters.bodyPart }),
        ...(filters.equipment && { equipment: filters.equipment }),
        ...(filters.target && { target: filters.target }),
        limit: limit.toString(),
        offset: offset.toString(),
      });
      const url = `${API_ENDPOINTS.EXERCISES.FILTER}?${params}`;
      const response = await apiClient.get<import('../types/api.types').ExerciseFilterResponse>(url);
      return response;
    } catch (error) {
      console.error('Filter exercises error:', error);
      throw error;
    }
  }
}

export default ExerciseService;
