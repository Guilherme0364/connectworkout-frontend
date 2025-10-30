/**
 * Exercise Image Service
 *
 * Provides utilities for loading exercise images from RapidAPI ExerciseDB
 * with proper resolution and headers
 */

import { ImageSourcePropType } from 'react-native';
import { API_CONFIG } from '../config/api.config';

/**
 * Available image resolutions
 */
export const RESOLUTION = {
  THUMBNAIL: 180,   // Extra small - tiny previews
  INSTRUCTOR: 360,  // Small - instructor lists (multiple exercises visible)
  STUDENT: 720,     // Medium - student detail view (single exercise)
  HD: 1080,         // Large - high-quality zoom, detailed inspection
} as const;

export type ResolutionType = typeof RESOLUTION[keyof typeof RESOLUTION];

/**
 * Exercise Image Service
 *
 * Handles all exercise image URL generation and React Native Image props
 */
export class ExerciseImageService {
  /**
   * Get image URL with specified resolution
   * URL format: https://exercisedb.p.rapidapi.com/image?exerciseId={id}&resolution={resolution}
   *
   * @param exerciseId - Exercise ID from ExerciseDB
   * @param resolution - Image resolution (180, 360, 720, or 1080)
   * @returns Complete image URL with resolution parameter
   */
  static getImageUrl(exerciseId: string, resolution: ResolutionType = RESOLUTION.STUDENT): string {
    // Validate resolution
    const validResolutions = [180, 360, 720, 1080];
    if (!validResolutions.includes(resolution)) {
      console.warn(`Invalid resolution ${resolution}, defaulting to ${RESOLUTION.STUDENT}`);
      resolution = RESOLUTION.STUDENT;
    }

    // Extract just the ID if full URL is passed
    const id = exerciseId.includes('?')
      ? exerciseId.split('exerciseId=')[1]?.split('&')[0]
      : exerciseId;

    return `https://exercisedb.p.rapidapi.com/image?exerciseId=${id}&resolution=${resolution}`;
  }

  /**
   * Get image URL optimized for instructor view (360px)
   * Use this when displaying multiple exercises in a list
   */
  static getInstructorImageUrl(exerciseId: string): string {
    return this.getImageUrl(exerciseId, RESOLUTION.INSTRUCTOR);
  }

  /**
   * Get image URL optimized for student view (720px)
   * Use this when displaying a single exercise in detail
   */
  static getStudentImageUrl(exerciseId: string): string {
    return this.getImageUrl(exerciseId, RESOLUTION.STUDENT);
  }

  /**
   * Get thumbnail image URL (180px)
   * Use this for tiny previews or icons
   */
  static getThumbnailImageUrl(exerciseId: string): string {
    return this.getImageUrl(exerciseId, RESOLUTION.THUMBNAIL);
  }

  /**
   * Get HD image URL (1080px)
   * Use this for high-quality zoom or detailed inspection
   */
  static getHDImageUrl(exerciseId: string): string {
    return this.getImageUrl(exerciseId, RESOLUTION.HD);
  }

  /**
   * Get complete image source props for React Native Image component
   * Includes URI and required RapidAPI headers
   *
   * @param exerciseId - Exercise ID or full gifUrl from API
   * @param resolution - Image resolution
   * @returns Image source object with uri and headers
   *
   * @example
   * <Image source={ExerciseImageService.getImageProps(exercise.exerciseDbId, RESOLUTION.INSTRUCTOR)} />
   */
  static getImageProps(
    exerciseId: string,
    resolution: ResolutionType = RESOLUTION.STUDENT
  ): { uri: string; headers: { [key: string]: string } } {
    return {
      uri: this.getImageUrl(exerciseId, resolution),
      headers: {
        'x-rapidapi-key': API_CONFIG.RAPID_API_KEY,
        'x-rapidapi-host': API_CONFIG.RAPID_API_HOST,
      },
    };
  }

  /**
   * Extract exercise ID from a gifUrl
   * Handles both old and new URL formats
   *
   * @param gifUrl - Full exercise image URL
   * @returns Exercise ID
   */
  static extractExerciseId(gifUrl: string): string {
    // New format: https://exercisedb.p.rapidapi.com/image?exerciseId=0285&resolution=720
    if (gifUrl.includes('exerciseId=')) {
      const match = gifUrl.match(/exerciseId=([^&]+)/);
      return match ? match[1] : gifUrl;
    }

    // Old format: https://v2.exercisedb.io/image/0285
    if (gifUrl.includes('/image/')) {
      const parts = gifUrl.split('/image/');
      return parts[1] || gifUrl;
    }

    // Fallback: assume it's just the ID
    return gifUrl;
  }

  /**
   * Check if a URL is a valid exercise image URL
   */
  static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return false;
    }

    // Check for RapidAPI format
    if (url.includes('exercisedb.p.rapidapi.com')) {
      return url.includes('exerciseId=');
    }

    // Check for old format (for backwards compatibility)
    if (url.includes('exercisedb.io')) {
      return url.includes('/image/');
    }

    return false;
  }
}

export default ExerciseImageService;
