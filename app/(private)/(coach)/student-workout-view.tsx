/**
 * Student Workout View Screen
 *
 * Shows the student's active workout plan from the coach's perspective
 * This is what the student sees about their workout - a read-only view organized by days
 */

import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DayCard from '../../components/DayCard';
import ExerciseCard from '../../components/ExerciseCard';
import EmptyState from '../../components/EmptyState';
import { WorkoutService, InstructorService } from '../../services';
import { handleApiError } from '../../utils/errorHandler';
import type { Workout, WorkoutSummary, WorkoutDay, UserDto } from '../../types/api.types';
import { DayOfWeekLabels } from '../../types/api.types';

export default function StudentWorkoutView() {
	const router = useRouter();
	const { studentId } = useLocalSearchParams<{ studentId: string }>();

	const [student, setStudent] = useState<UserDto | null>(null);
	const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
	const [loading, setLoading] = useState(true);
	const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/(private)/(coach)/(tabs)/students');
		}
	};

	// Load student and active workout on mount
	useEffect(() => {
		if (studentId) {
			loadStudentWorkout();
		}
	}, [studentId]);

	const loadStudentWorkout = async () => {
		try {
			setLoading(true);

			// Fetch student details and workouts in parallel
			const [studentData, workoutsData] = await Promise.all([
				InstructorService.getStudentDetails(Number(studentId)),
				WorkoutService.getStudentWorkouts(Number(studentId)),
			]);

			setStudent(studentData);

			// Find active workout
			const active = workoutsData.find((w) => w.isActive);

			if (active) {
				// Fetch full workout details
				const workoutDetails = await WorkoutService.getWorkoutDetails(active.id);
				setActiveWorkout(workoutDetails);

				// Expand all days by default
				const allDayIds = workoutDetails.workoutDays.map((d) => d.id);
				setExpandedDays(new Set(allDayIds));
			} else {
				setActiveWorkout(null);
			}
		} catch (error) {
			handleApiError(error, 'Não foi possível carregar o treino do aluno');
			router.back();
		} finally {
			setLoading(false);
		}
	};

	const handleManageWorkouts = () => {
		router.push(`/(private)/(coach)/(workout)/student-workouts?studentId=${studentId}`);
	};

	const toggleDayExpanded = (dayId: number) => {
		setExpandedDays((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(dayId)) {
				newSet.delete(dayId);
			} else {
				newSet.add(dayId);
			}
			return newSet;
		});
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#BBF246" />
					<Text style={styles.loadingText}>Carregando treino...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.backButton} onPress={handleBack}>
						<Ionicons name="arrow-back" size={24} color="#111827" />
					</TouchableOpacity>
					<View style={styles.headerContent}>
						<Text style={styles.title}>{student?.name || 'Aluno'}</Text>
						<Text style={styles.subtitle}>Ficha de Treino</Text>
					</View>
					<TouchableOpacity style={styles.manageButton} onPress={handleManageWorkouts}>
						<Ionicons name="settings-outline" size={22} color="#BBF246" />
					</TouchableOpacity>
				</View>

				{/* Active Workout Info */}
				{activeWorkout ? (
					<>
						<View style={styles.workoutInfoCard}>
							<View style={styles.workoutHeader}>
								<View style={styles.workoutIconContainer}>
									<Ionicons name="barbell" size={28} color="#BBF246" />
								</View>
								<View style={styles.workoutInfo}>
									<Text style={styles.workoutName}>{activeWorkout.name}</Text>
									<View style={styles.activeBadge}>
										<Ionicons name="checkmark-circle" size={14} color="#10B981" />
										<Text style={styles.activeBadgeText}>Treino Ativo</Text>
									</View>
								</View>
							</View>
							<View style={styles.workoutStats}>
								<View style={styles.workoutStat}>
									<Text style={styles.workoutStatValue}>
										{activeWorkout.workoutDays.length}
									</Text>
									<Text style={styles.workoutStatLabel}>dias</Text>
								</View>
								<View style={styles.workoutStat}>
									<Text style={styles.workoutStatValue}>
										{activeWorkout.workoutDays.reduce(
											(sum, day) => sum + day.exercises.length,
											0
										)}
									</Text>
									<Text style={styles.workoutStatLabel}>exercícios</Text>
								</View>
							</View>
						</View>

						{/* Days & Exercises */}
						<View style={styles.daysSection}>
							<Text style={styles.sectionTitle}>Treino Semanal</Text>

							{activeWorkout.workoutDays.length === 0 ? (
								<View style={styles.emptyDaysState}>
									<Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
									<Text style={styles.emptyDaysText}>
										Este treino ainda não tem dias configurados
									</Text>
								</View>
							) : (
								<View style={styles.daysList}>
									{activeWorkout.workoutDays.map((day) => (
										<View key={day.id} style={styles.dayContainer}>
											{/* Day Header */}
											<TouchableOpacity
												style={styles.dayHeader}
												onPress={() => toggleDayExpanded(day.id)}
												activeOpacity={0.7}
											>
												<View style={styles.dayHeaderLeft}>
													<View style={styles.dayIconContainer}>
														<Ionicons name="calendar" size={20} color="#BBF246" />
													</View>
													<View>
														<Text style={styles.dayName}>
															{DayOfWeekLabels[day.dayOfWeek]}
														</Text>
														<Text style={styles.dayExerciseCount}>
															{day.exercises.length}{' '}
															{day.exercises.length === 1
																? 'exercício'
																: 'exercícios'}
														</Text>
													</View>
												</View>
												<Ionicons
													name={
														expandedDays.has(day.id)
															? 'chevron-up'
															: 'chevron-down'
													}
													size={24}
													color="#9CA3AF"
												/>
											</TouchableOpacity>

											{/* Exercises List (Expanded) */}
											{expandedDays.has(day.id) && (
												<View style={styles.exercisesList}>
													{day.exercises.length === 0 ? (
														<View style={styles.noExercisesState}>
															<Ionicons
																name="barbell-outline"
																size={28}
																color="#9CA3AF"
															/>
															<Text style={styles.noExercisesText}>
																Nenhum exercício neste dia
															</Text>
														</View>
													) : (
														day.exercises.map((exercise) => (
															<View
																key={exercise.id}
																style={styles.exerciseCardContainer}
															>
																<ExerciseCard exercise={exercise} />
															</View>
														))
													)}
												</View>
											)}
										</View>
									))}
								</View>
							)}
						</View>
					</>
				) : (
					/* No Active Workout */
					<View style={styles.noWorkoutContainer}>
						<EmptyState
							icon="barbell-outline"
							title="Sem treino ativo"
							description="Este aluno ainda não possui um treino ativo. Crie um treino para começar."
							iconColor="#9CA3AF"
						/>
						<TouchableOpacity style={styles.createWorkoutButton} onPress={handleManageWorkouts}>
							<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
							<Text style={styles.createWorkoutButtonText}>Gerenciar Treinos</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.bottomSpacing} />
			</ScrollView>

			{/* Floating Manage Button */}
			{activeWorkout && (
				<TouchableOpacity style={styles.fab} onPress={handleManageWorkouts}>
					<Ionicons name="settings-outline" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F9FAFB',
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: '#6B7280',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 16,
		paddingBottom: 24,
	},
	backButton: {
		marginRight: 16,
		padding: 4,
	},
	headerContent: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 14,
		color: '#6B7280',
	},
	manageButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: '#EFF6FF',
	},
	workoutInfoCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	workoutHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	workoutIconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#EFF6FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	workoutInfo: {
		flex: 1,
	},
	workoutName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 6,
	},
	activeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		alignSelf: 'flex-start',
		backgroundColor: '#10B98115',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	activeBadgeText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#10B981',
	},
	workoutStats: {
		flexDirection: 'row',
		gap: 32,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#F3F4F6',
	},
	workoutStat: {
		alignItems: 'center',
	},
	workoutStatValue: {
		fontSize: 24,
		fontWeight: '700',
		color: '#3B82F6',
	},
	workoutStatLabel: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 4,
	},
	daysSection: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	emptyDaysState: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 40,
		alignItems: 'center',
	},
	emptyDaysText: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 12,
		textAlign: 'center',
	},
	daysList: {},
	dayContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		marginBottom: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	dayHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	dayHeaderLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	dayIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#EFF6FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	dayName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	dayExerciseCount: {
		fontSize: 14,
		color: '#6B7280',
	},
	exercisesList: {
		paddingHorizontal: 16,
		paddingBottom: 16,
		borderTopWidth: 1,
		borderTopColor: '#F3F4F6',
	},
	exerciseCardContainer: {
		marginTop: 12,
	},
	noExercisesState: {
		alignItems: 'center',
		paddingVertical: 24,
	},
	noExercisesText: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 8,
	},
	noWorkoutContainer: {
		marginTop: 40,
	},
	createWorkoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#BBF246',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginTop: 24,
		marginHorizontal: 20,
		shadowColor: '#BBF246',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	createWorkoutButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	bottomSpacing: {
		height: 80,
	},
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#BBF246',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
});
