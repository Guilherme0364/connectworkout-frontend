# Backend Integration Guide - New Endpoints

This document describes the frontend updates made to integrate the new backend endpoints for improved workout creation and exercise search.

## Overview of Changes

### 1. New Type Definitions (`app/types/api.types.ts`)

Added the following interfaces to support the new endpoints:

```typescript
// Bulk workout creation
export interface BulkWorkoutDayRequest {
  dayOfWeek: DayOfWeek;
  exercises: AddExerciseRequest[];
}

export interface BulkWorkoutRequest {
  name: string;
  studentId: number;
  workoutDays: BulkWorkoutDayRequest[];
}

export interface BulkWorkoutResponse {
  id: number;
  name: string;
  message: string;
}

// Exercise search and filter responses
export interface ExerciseSearchResponse {
  data: ExerciseDbModel[];
  total: number;
  limit: number;
  offset: number;
}

export interface ExerciseFilterResponse {
  data: ExerciseDbModel[];
  total: number;
  limit: number;
  offset: number;
  filters: {
    name?: string;
    bodyPart?: string;
    equipment?: string;
    target?: string;
  };
}
```

### 2. Updated API Configuration (`app/config/api.config.ts`)

Added new endpoint definitions:

```typescript
EXERCISES: {
  // ... existing endpoints
  FILTER: '/api/exercises/filter',  // NEW
},

WORKOUTS: {
  // ... existing endpoints
  CREATE_WORKOUT_BULK: '/api/workouts/bulk',  // NEW
}
```

### 3. Enhanced Workout Service (`app/services/workout.service.ts`)

Added new method for bulk workout creation:

```typescript
/**
 * Create a new workout with days and exercises in a single request (BULK)
 * Requires authentication and Instructor role
 * This is the recommended way to create workouts with exercises
 */
static async createWorkoutBulk(
  data: BulkWorkoutRequest
): Promise<BulkWorkoutResponse>
```

### 4. Enhanced Exercise Service (`app/services/exercise.service.ts`)

Added two new methods:

#### Search with Pagination
```typescript
/**
 * Search exercises by name with pagination
 * @param name - Exercise name to search for
 * @param limit - Maximum number of results (default: 30)
 * @param offset - Number of results to skip (default: 0)
 */
static async searchExercisesWithPagination(
  name: string,
  limit: number = 30,
  offset: number = 0
): Promise<ExerciseSearchResponse>
```

#### Multi-Filter Search
```typescript
/**
 * Filter exercises by multiple criteria with pagination
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
): Promise<ExerciseFilterResponse>
```

## How to Use the New Features

### Example 1: Create Workout with Bulk Endpoint

**Before (OLD - causes 400 errors):**
```typescript
// DON'T DO THIS
const workout = await WorkoutService.createWorkout({
  studentId: 1,
  name: "My Workout",
  workoutDays: [...] // This doesn't work!
});
```

**After (NEW - recommended):**
```typescript
import { WorkoutService } from '@/services';
import { DayOfWeek } from '@/types/api.types';

const bulkWorkout = {
  name: "Full Body Workout",
  studentId: 1,
  workoutDays: [
    {
      dayOfWeek: DayOfWeek.Monday,
      exercises: [
        {
          exerciseDbId: "0001",
          name: "Bench Press",
          bodyPart: "chest",
          equipment: "barbell",
          gifUrl: "https://v2.exercisedb.io/image/0001",
          sets: "3",
          repetitions: "12",
          weight: 50.0,
          restSeconds: 90,
          notes: "Keep elbows at 45 degrees"
        }
      ]
    },
    {
      dayOfWeek: DayOfWeek.Wednesday,
      exercises: [
        {
          exerciseDbId: "0002",
          name: "Squats",
          bodyPart: "legs",
          equipment: "barbell",
          gifUrl: "https://v2.exercisedb.io/image/0002",
          sets: "4",
          repetitions: "10",
          weight: 80.0,
          restSeconds: 120,
          notes: "Depth to parallel"
        }
      ]
    }
  ]
};

const result = await WorkoutService.createWorkoutBulk(bulkWorkout);
console.log(`Created workout ${result.name} with ID ${result.id}`);
```

### Example 2: Search Exercises with Pagination

```typescript
import { ExerciseService } from '@/services';

const [searchResults, setSearchResults] = useState([]);
const [page, setPage] = useState(0);
const limit = 30;

const searchExercises = async (searchTerm: string) => {
  const response = await ExerciseService.searchExercisesWithPagination(
    searchTerm,
    limit,
    page * limit
  );

  setSearchResults(response.data);

  // response.total gives you the total count for pagination
  const totalPages = Math.ceil(response.total / limit);
};
```

### Example 3: Filter Exercises by Multiple Criteria

```typescript
import { ExerciseService } from '@/services';

const [filters, setFilters] = useState({
  bodyPart: '',
  equipment: '',
  target: ''
});

const filterExercises = async () => {
  const response = await ExerciseService.filterExercises(
    {
      name: searchTerm,
      bodyPart: filters.bodyPart || undefined,
      equipment: filters.equipment || undefined,
      target: filters.target || undefined,
    },
    30,
    0
  );

  // response.data contains the filtered exercises
  // response.filters shows what filters were applied
  return response.data;
};
```

### Example 4: Load Filter Options

```typescript
import { ExerciseService } from '@/services';

const [bodyParts, setBodyParts] = useState<string[]>([]);
const [equipments, setEquipments] = useState<string[]>([]);

useEffect(() => {
  const loadFilterOptions = async () => {
    const bodyPartsData = await ExerciseService.getBodyParts();
    const equipmentsData = await ExerciseService.getEquipments();

    setBodyParts(bodyPartsData);
    setEquipments(equipmentsData);
  };

  loadFilterOptions();
}, []);

// Render dropdowns
<select onChange={(e) => setFilters({...filters, bodyPart: e.target.value})}>
  <option value="">All Body Parts</option>
  {bodyParts.map(bp => (
    <option key={bp} value={bp}>{capitalizeFirst(translateBodyPart(bp))}</option>
  ))}
</select>
```

### Example 5: Display Exercise GIFs

The `ExerciseCard` component already supports GIF display. All exercises from the API include a `gifUrl` field:

```typescript
import ExerciseCard from '@/components/ExerciseCard';

<ExerciseCard
  exercise={exercise}
  onEdit={() => handleEdit(exercise)}
  onDelete={() => handleDelete(exercise)}
/>
```

The GIF will automatically be displayed from `exercise.gifUrl`.

## DayOfWeek Enum Values

When creating workouts, use these values for `dayOfWeek`:

```typescript
DayOfWeek.Sunday    // 0
DayOfWeek.Monday    // 1
DayOfWeek.Tuesday   // 2
DayOfWeek.Wednesday // 3
DayOfWeek.Thursday  // 4
DayOfWeek.Friday    // 5
DayOfWeek.Saturday  // 6
```

## Key Improvements

### ✅ Fixed Issues
1. **400 Bad Request on Workout Creation** - Use `createWorkoutBulk()` instead
2. **Poor Exercise Search** - Better matching with `searchExercisesWithPagination()`
3. **Missing Pagination** - All search/filter methods now support pagination

### ✅ New Features
1. **Pagination** - Load exercises in chunks (default 30 per page)
2. **Multi-filter Search** - Combine name, body part, equipment, and target filters
3. **Better Word Matching** - Searching "bench" finds all bench press variations
4. **Filter Dropdowns** - API provides lists of valid body parts, equipment, and targets
5. **GIF Display** - All exercises include `gifUrl` for animated previews

## Migration Checklist

### For Screens Using Workout Creation:
- [ ] Replace `WorkoutService.createWorkout()` with `WorkoutService.createWorkoutBulk()`
- [ ] Update request payload to include `workoutDays` array
- [ ] Test creating workouts with multiple days and exercises

### For Screens Using Exercise Search:
- [ ] Update to use `ExerciseService.searchExercisesWithPagination()` or `filterExercises()`
- [ ] Add pagination controls (limit/offset)
- [ ] Implement filter dropdowns using `getBodyParts()` and `getEquipments()`
- [ ] Verify exercise GIFs display correctly

## Testing

A test script has been provided in `test-new-endpoints.js`. To use it:

1. Get a valid access token by logging in
2. Edit the script and set `ACCESS_TOKEN`
3. Run: `node test-new-endpoints.js`

This will test all new endpoints and verify they're working correctly.

## Translation Utilities

Exercise data from the API is in English. Use the translation utilities in `app/utils/exerciseTranslations.ts`:

```typescript
import {
  translateBodyPart,
  translateEquipment,
  translateTarget,
  capitalizeFirst
} from '@/utils/exerciseTranslations';

// Translate to Portuguese
const bodyPartPT = translateBodyPart('chest'); // "peito"
const equipmentPT = translateEquipment('barbell'); // "barra"
const targetPT = translateTarget('pectorals'); // "peitorais"

// Capitalize for display
const displayText = capitalizeFirst(bodyPartPT); // "Peito"
```

## Need Help?

If you encounter any issues:

1. Check the backend is running on `http://localhost:7009`
2. Verify you have a valid authentication token
3. Use the test script to verify endpoints are responding
4. Check the browser/metro console for detailed error messages

## Summary

The frontend is now fully integrated with the new backend endpoints:

- ✅ Type definitions added
- ✅ API endpoints configured
- ✅ Service methods implemented
- ✅ Exercise translations ready
- ✅ Components support GIF display
- ✅ Test script provided

You can now use the bulk workout creation endpoint to avoid 400 errors, and the enhanced exercise search with pagination and filtering for a better user experience!
