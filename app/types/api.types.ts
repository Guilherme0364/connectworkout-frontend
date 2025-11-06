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

export interface SocialLinks {
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  userType: UserType;
  description: string;
  // Enhanced profile fields (Phase 1)
  phone?: string | null;
  certifications?: string | null;
  specializations?: string | null;
  bio?: string | null;
  yearsOfExperience?: number | null;
  socialLinks?: SocialLinks | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  name?: string;
  age?: number;
  gender?: Gender;
  description?: string;
  currentPassword?: string;
  newPassword?: string;
  // Enhanced profile fields (Phase 1)
  phone?: string;
  certifications?: string;
  specializations?: string;
  bio?: string;
  yearsOfExperience?: number;
  socialLinks?: SocialLinks;
}

// ============================================================================
// Instructor DTOs
// ============================================================================

export interface ConnectStudentDto {
  email?: string;       // Student's email (option 1)
  studentId?: number;   // Student's ID (option 2)
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
  enrolledAt: string; // ISO 8601 date string (Phase 1)
}

export interface StatisticTrend {
  value: number;
  isPositive: boolean;
}

export interface InstructorStatistics {
  // Workout Statistics
  workoutsCreatedThisMonth: number;
  workoutsCreatedThisWeek: number;
  workoutsCreatedTotal: number;

  // Student Statistics
  totalStudents: number;
  activeStudents: number;
  newStudentsThisWeek: number;
  newStudentsThisMonth: number;

  // Completion Statistics (percentages)
  averageCompletionRate: number;
  completionRateToday: number;
  completionRateThisWeek: number;
  completionRateThisMonth: number;

  // Engagement Statistics
  totalWorkoutsCompletedThisMonth: number;
  totalExercisesCompletedThisMonth: number;

  // Trends (comparison with previous period)
  studentsTrend: StatisticTrend;
  completionRateTrend: StatisticTrend;
  workoutsCreatedTrend: StatisticTrend;
}

// ============================================================================
// Student DTOs
// ============================================================================

export enum TrainerRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface TrainerDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  description: string;
  studentCount: number;
  credentials?: string;
  photoUrl?: string;
}

export interface TrainerRequestDto {
  id: number;
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainerStudentCount: number;
  trainerCredentials?: string;
  trainerPhotoUrl?: string;
  status: TrainerRequestStatus;
  createdAt: string;
}

// New invitation workflow types
export interface InvitationDto {
  invitationId: number;
  instructorId: number;
  instructorName: string;
  instructorEmail: string;
  instructorDescription: string;
  instructorStudentCount: number;
  invitedAt: string;
}

// Student info in invitation response
export interface StudentInfo {
  id: number;
  name: string;
  email: string;
  age: number | null;
  gender: Gender | null;
}

// Instructor invitation DTO (matches backend GET /api/instructors/invitations)
export interface InstructorInvitationDto {
  id: number;
  student: StudentInfo;
  status: 0 | 1 | 2; // 0=Pending, 1=Accepted, 2=Rejected
  statusName: 'Pending' | 'Accepted' | 'Rejected';
  invitedAt: string;
  respondedAt: string | null;
  connectedAt: string | null;
}

export interface AcceptTrainerDto {
  trainerId: number;
}

export interface StudentProfileDto {
  id: number;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  description: string;
  cpf?: string;
  phone?: string;
  photoUrl?: string;
  hasTrainer: boolean;
  trainerId?: number;
}

export interface UpdateStudentProfileDto {
  name?: string;
  age?: number;
  gender?: Gender;
  description?: string;
  cpf?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  photoUrl?: string;
}

export interface InstructorSummary {
  id: number;
  name: string;
  email: string;
  description: string;
  studentCount: number;
}

export interface StudentDashboardDto {
  studentName: string;
  hasTrainer: boolean;
  currentTrainer: InstructorSummary | null;
  workoutCount: number;
  exerciseCount: number;
  activeWorkoutId: number | null;
  pendingRequestsCount: number;
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

// ============================================================================
// Workout DTOs
// ============================================================================

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.Sunday]: 'Domingo',
  [DayOfWeek.Monday]: 'Segunda',
  [DayOfWeek.Tuesday]: 'Terça',
  [DayOfWeek.Wednesday]: 'Quarta',
  [DayOfWeek.Thursday]: 'Quinta',
  [DayOfWeek.Friday]: 'Sexta',
  [DayOfWeek.Saturday]: 'Sábado',
};

export interface Workout {
  id: number;
  name: string;
  createdAt: string;
  isActive: boolean;
  workoutDays: WorkoutDay[];
}

export interface WorkoutSummary {
  id: number;
  name: string;
  createdAt: string;
  isActive: boolean;
  daysCount: number;
  exercisesCount: number;
}

export interface WorkoutDay {
  id: number;
  dayOfWeek: DayOfWeek;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  exerciseDbId: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  sets: string;
  repetitions: string;
  weight?: number;
  restSeconds?: number;
  order: number;
  notes: string;
}

// Request DTOs
export interface CreateWorkoutRequest {
  studentId: number;
  name: string;
}

export interface AddWorkoutDayRequest {
  dayOfWeek: DayOfWeek;
}

export interface AddExerciseRequest {
  exerciseDbId: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  sets: string;
  repetitions: string;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface UpdateExerciseRequest {
  sets?: string;
  repetitions?: string;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

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
