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
      const response = await apiClient.get<ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.SEARCH,
        {
          params: { name },
        }
      );
      return response.data;
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
      return response.data;
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
      return response.data;
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
      const response = await apiClient.get<ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_BODY_PART(bodyPart)
      );
      return response.data;
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
      return response.data;
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
      const response = await apiClient.get<ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_TARGET(target)
      );
      return response.data;
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
      return response.data;
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
      const response = await apiClient.get<ExerciseDbModel[]>(
        API_ENDPOINTS.EXERCISES.GET_BY_EQUIPMENT(equipment)
      );
      return response.data;
    } catch (error) {
      console.error('Get exercises by equipment error:', error);
      throw error;
    }
  }
}

export default ExerciseService;
