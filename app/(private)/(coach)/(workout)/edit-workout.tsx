/**
 * Edit Workout Screen
 *
 * Full workout editor allowing coaches to:
 * - Edit workout name and active status
 * - Add/delete workout days
 * - Add/edit/delete exercises for each day
 * - Search and configure exercises
 */

import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	Modal,
	Switch,
	ActivityIndicator,
	Alert,
	Platform,
	FlatList,
	Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DayCard from '../../../components/DayCard';
import ExerciseCard from '../../../components/ExerciseCard';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { WorkoutService, ExerciseService } from '../../../services';
import { handleApiError, showSuccess } from '../../../utils/errorHandler';
import { ExerciseImageService, RESOLUTION } from '../../../services/exerciseImage.service';
import type {
	Workout,
	WorkoutDay,
	Exercise,
	DayOfWeek,
	ExerciseDbModel,
} from '../../../types/api.types';
import { DayOfWeekLabels } from '../../../types/api.types';

export default function EditWorkout() {
	const router = useRouter();
	const { workoutId } = useLocalSearchParams<{ workoutId: string }>();

	// Workout state
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Workout editing state
	const [workoutName, setWorkoutName] = useState('');
	const [isActive, setIsActive] = useState(false);
	const [expandedDay, setExpandedDay] = useState<number | null>(null);

	// Add Day Modal
	const [addDayModalVisible, setAddDayModalVisible] = useState(false);
	const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<DayOfWeek | null>(null);
	const [addingDay, setAddingDay] = useState(false);

	// Delete Day Dialog
	const [deleteDayDialogVisible, setDeleteDayDialogVisible] = useState(false);
	const [dayToDelete, setDayToDelete] = useState<WorkoutDay | null>(null);
	const [deletingDay, setDeletingDay] = useState(false);

	// Add/Edit Exercise Modal
	const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
	const [exerciseModalMode, setExerciseModalMode] = useState<'add' | 'edit'>('add');
	const [selectedDayForExercise, setSelectedDayForExercise] = useState<WorkoutDay | null>(null);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

	// Exercise Search
	const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<ExerciseDbModel[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedExerciseDb, setSelectedExerciseDb] = useState<ExerciseDbModel | null>(null);
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
	const [searchError, setSearchError] = useState<string | null>(null);

	// Exercise Form
	const [exerciseSets, setExerciseSets] = useState('3');
	const [exerciseReps, setExerciseReps] = useState('10');
	const [exerciseWeight, setExerciseWeight] = useState('');
	const [exerciseRest, setExerciseRest] = useState('60');
	const [exerciseNotes, setExerciseNotes] = useState('');
	const [savingExercise, setSavingExercise] = useState(false);

	// Delete Exercise Dialog
	const [deleteExerciseDialogVisible, setDeleteExerciseDialogVisible] = useState(false);
	const [exerciseToDelete, setExerciseToDelete] = useState<{
		day: WorkoutDay;
		exercise: Exercise;
	} | null>(null);
	const [deletingExercise, setDeletingExercise] = useState(false);

	// Load workout on mount
	useEffect(() => {
		if (workoutId) {
			loadWorkout();
		}
	}, [workoutId]);

	// Cleanup search timeout on unmount
	useEffect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	}, [searchTimeout]);

	const loadWorkout = async () => {
		try {
			setLoading(true);
			const data = await WorkoutService.getWorkoutDetails(Number(workoutId));
			setWorkout(data);
			setWorkoutName(data.name);
			setIsActive(data.isActive);
		} catch (error) {
			handleApiError(error, 'Não foi possível carregar o treino');
			handleBack();
		} finally {
			setLoading(false);
		}
	};

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/(private)/(coach)/(tabs)/students');
		}
	};

	// ============================================================================
	// Workout Name & Active Status
	// ============================================================================

	const handleSaveWorkoutInfo = async () => {
		if (!workoutName.trim()) {
			if (Platform.OS === 'web') {
				window.alert('O nome do treino é obrigatório');
			} else {
				Alert.alert('Erro', 'O nome do treino é obrigatório');
			}
			return;
		}

		try {
			setSaving(true);
			await WorkoutService.updateWorkout(Number(workoutId), {
				name: workoutName.trim(),
				isActive,
			});
			showSuccess('Sucesso', 'Treino criado com sucesso!');

			// Navigate back to student-workouts screen
			if (workout?.studentId) {
				router.replace(`/(private)/(coach)/(workout)/student-workouts?studentId=${workout.studentId}`);
			} else {
				// Fallback to students screen if studentId is not available
				router.replace('/(private)/(coach)/(tabs)/students');
			}
		} catch (error) {
			handleApiError(error, 'Não foi possível atualizar o treino');
		} finally {
			setSaving(false);
		}
	};

	// ============================================================================
	// Add Day
	// ============================================================================

	const handleOpenAddDayModal = () => {
		setSelectedDayOfWeek(null);
		setAddDayModalVisible(true);
	};

	const handleAddDay = async () => {
		if (selectedDayOfWeek === null) {
			if (Platform.OS === 'web') {
				window.alert('Selecione um dia da semana');
			} else {
				Alert.alert('Erro', 'Selecione um dia da semana');
			}
			return;
		}

		try {
			setAddingDay(true);
			await WorkoutService.addWorkoutDay(Number(workoutId), {
				dayOfWeek: selectedDayOfWeek,
			});
			setAddDayModalVisible(false);
			showSuccess('Sucesso', 'Dia adicionado com sucesso');
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'Não foi possível adicionar o dia');
		} finally {
			setAddingDay(false);
		}
	};

	// ============================================================================
	// Delete Day
	// ============================================================================

	const handleDeleteDayPress = (day: WorkoutDay) => {
		setDayToDelete(day);
		setDeleteDayDialogVisible(true);
	};

	const handleDeleteDayConfirm = async () => {
		if (!dayToDelete) return;

		try {
			setDeletingDay(true);
			await WorkoutService.deleteWorkoutDay(Number(workoutId), dayToDelete.id);
			setDeleteDayDialogVisible(false);
			setDayToDelete(null);
			showSuccess('Sucesso', 'Dia excluído com sucesso');
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'Não foi possível excluir o dia');
		} finally {
			setDeletingDay(false);
		}
	};

	// ============================================================================
	// Add Exercise
	// ============================================================================

	const handleAddExercisePress = (day: WorkoutDay) => {
		setExerciseModalMode('add');
		setSelectedDayForExercise(day);
		setSelectedExerciseDb(null);
		setExerciseSearchQuery('');
		setSearchResults([]);
		setSearchError(null);
		setSearching(false);
		setExerciseSets('3');
		setExerciseReps('10');
		setExerciseWeight('');
		setExerciseRest('60');
		setExerciseNotes('');
		setExerciseModalVisible(true);
	};

	const handleSearchExercises = (query: string) => {
		setExerciseSearchQuery(query);
		setSearchError(null);

		// Clear previous timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Clear results if query is too short
		if (query.trim().length < 2) {
			setSearchResults([]);
			setSearching(false);
			setSearchError(null);
			return;
		}

		// Show searching state immediately
		setSearching(true);

		// Debounce the API call
		const timeout = setTimeout(async () => {
			try {
				console.log('🔍 Searching exercises with query:', query.trim());
				const results = await ExerciseService.searchExercises(query.trim());
				console.log('✅ Search results received:', results.length, 'exercises');
				console.log('📋 First result sample:', results[0]);

				setSearchResults(results);
				setSearchError(null);

				if (results.length === 0) {
					setSearchError('No exercises found. Try searching in English (e.g., "dumbbell", "press", "squat")');
				}
			} catch (error: any) {
				console.error('❌ Search exercises error:', error);
				console.error('Error details:', {
					message: error.message,
					status: error.status,
					errors: error.errors,
				});
				setSearchResults([]);
				setSearchError(
					error.message || 'Failed to search exercises. Please check your connection and try again.'
				);
			} finally {
				setSearching(false);
			}
		}, 500); // Wait 500ms after user stops typing

		setSearchTimeout(timeout);
	};

	const handleSelectExerciseDb = (exercise: ExerciseDbModel) => {
		setSelectedExerciseDb(exercise);
	};

	const handleSaveExercise = async () => {
		if (!selectedDayForExercise) return;

		if (exerciseModalMode === 'add' && !selectedExerciseDb) {
			if (Platform.OS === 'web') {
				window.alert('Selecione um exercício');
			} else {
				Alert.alert('Erro', 'Selecione um exercício');
			}
			return;
		}

		// Validate all required fields exist for new exercises
		if (exerciseModalMode === 'add' && selectedExerciseDb) {
			const missingFields: string[] = [];

			if (!selectedExerciseDb.gifUrl) missingFields.push('imagem (gifUrl)');
			if (!selectedExerciseDb.bodyPart) missingFields.push('parte do corpo (bodyPart)');
			if (!selectedExerciseDb.equipment) missingFields.push('equipamento (equipment)');

			if (missingFields.length > 0) {
				const errorMessage = `Erro: O exercício selecionado está incompleto. Campos faltando: ${missingFields.join(', ')}`;
				console.error('❌ Missing required fields for exercise:', selectedExerciseDb);
				console.error('❌ Missing fields:', missingFields);

				if (Platform.OS === 'web') {
					window.alert(errorMessage);
				} else {
					Alert.alert('Erro', errorMessage);
				}
				return;
			}
		}

		if (!exerciseSets.trim() || !exerciseReps.trim()) {
			if (Platform.OS === 'web') {
				window.alert('Séries e repetições são obrigatórias');
			} else {
				Alert.alert('Erro', 'Séries e repetições são obrigatórias');
			}
			return;
		}

		// Validate weight and rest are valid numbers
		const parsedWeight = exerciseWeight.trim() ? parseFloat(exerciseWeight.trim()) : null;
		const parsedRest = exerciseRest.trim() ? parseInt(exerciseRest.trim(), 10) : null;

		if (exerciseWeight.trim() && (isNaN(parsedWeight!) || parsedWeight! < 0)) {
			if (Platform.OS === 'web') {
				window.alert('Peso deve ser um número válido');
			} else {
				Alert.alert('Erro', 'Peso deve ser um número válido');
			}
			return;
		}

		if (exerciseRest.trim() && (isNaN(parsedRest!) || parsedRest! < 0)) {
			if (Platform.OS === 'web') {
				window.alert('Descanso deve ser um número válido em segundos');
			} else {
				Alert.alert('Erro', 'Descanso deve ser um número válido em segundos');
			}
			return;
		}

		try {
			setSavingExercise(true);

			if (exerciseModalMode === 'add' && selectedExerciseDb) {
				// Add new exercise
				const exercisePayload = {
					exerciseDbId: selectedExerciseDb.id,
					name: selectedExerciseDb.name,
					bodyPart: selectedExerciseDb.bodyPart,
					equipment: selectedExerciseDb.equipment,
					gifUrl: selectedExerciseDb.gifUrl,
					sets: exerciseSets.trim(),
					repetitions: exerciseReps.trim(),
					weight: parsedWeight ?? null,
					restSeconds: parsedRest ?? null,
					notes: exerciseNotes.trim() || "",
				};

				console.log('➕ Adding exercise with COMPLETE data:', exercisePayload);
				console.log('✅ All required fields present:', {
					exerciseDbId: !!exercisePayload.exerciseDbId,
					name: !!exercisePayload.name,
					bodyPart: !!exercisePayload.bodyPart,
					equipment: !!exercisePayload.equipment,
					gifUrl: !!exercisePayload.gifUrl,
					sets: !!exercisePayload.sets,
					repetitions: !!exercisePayload.repetitions,
				});

				await WorkoutService.addExercise(
					Number(workoutId),
					selectedDayForExercise.id,
					exercisePayload
				);
				console.log('✅ Exercise added successfully');
				showSuccess('Sucesso', 'Exercício adicionado com sucesso');
			} else if (exerciseModalMode === 'edit' && selectedExercise) {
				// Update existing exercise
				await WorkoutService.updateExercise(
					Number(workoutId),
					selectedDayForExercise.id,
					selectedExercise.id,
					{
						sets: exerciseSets.trim(),
						repetitions: exerciseReps.trim(),
						weight: parsedWeight ?? undefined,
						restSeconds: parsedRest ?? undefined,
						notes: exerciseNotes.trim() || "",
					}
				);
				showSuccess('Sucesso', 'Exercício atualizado com sucesso');
			}

			// Close modal and reset state BEFORE reloading
			setExerciseModalVisible(false);

			// Reset all exercise modal state to prevent issues with multiple additions
			setSelectedExerciseDb(null);
			setExerciseSearchQuery('');
			setSearchResults([]);
			setSearchError(null);
			setSearching(false);
			setExerciseSets('3');
			setExerciseReps('10');
			setExerciseWeight('');
			setExerciseRest('60');
			setExerciseNotes('');

			// Reload workout data
			await loadWorkout();
		} catch (error) {
			console.error('❌ Failed to save exercise:', error);
			handleApiError(error, 'Não foi possível salvar o exercício');
		} finally {
			setSavingExercise(false);
		}
	};

	// ============================================================================
	// Edit Exercise
	// ============================================================================

	const handleEditExercisePress = (day: WorkoutDay, exercise: Exercise) => {
		setExerciseModalMode('edit');
		setSelectedDayForExercise(day);
		setSelectedExercise(exercise);
		setExerciseSets(exercise.sets);
		setExerciseReps(exercise.repetitions);
		setExerciseWeight(exercise.weight ? exercise.weight.toString() : '');
		setExerciseRest(exercise.restSeconds ? exercise.restSeconds.toString() : '60');
		setExerciseNotes(exercise.notes || '');
		setExerciseModalVisible(true);
	};

	// ============================================================================
	// Delete Exercise
	// ============================================================================

	const handleDeleteExercisePress = (day: WorkoutDay, exercise: Exercise) => {
		setExerciseToDelete({ day, exercise });
		setDeleteExerciseDialogVisible(true);
	};

	const handleDeleteExerciseConfirm = async () => {
		if (!exerciseToDelete) return;

		try {
			setDeletingExercise(true);
			await WorkoutService.deleteExercise(
				Number(workoutId),
				exerciseToDelete.day.id,
				exerciseToDelete.exercise.id
			);
			setDeleteExerciseDialogVisible(false);
			setExerciseToDelete(null);
			showSuccess('Sucesso', 'Exercício excluído com sucesso');
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'Não foi possível excluir o exercício');
		} finally {
			setDeletingExercise(false);
		}
	};

	// ============================================================================
	// Render
	// ============================================================================

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

	if (!workout) {
		return null;
	}

	const daysOfWeek: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
	const usedDays = workout.workoutDays.map(d => d.dayOfWeek);
	const availableDays = daysOfWeek.filter(d => !usedDays.includes(d));

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.backButton} onPress={handleBack}>
						<Ionicons name="arrow-back" size={24} color="#111827" />
					</TouchableOpacity>
					<View style={styles.headerContent}>
						<Text style={styles.title}>Editar Treino</Text>
					</View>
				</View>

				{/* Workout Info Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Informações do Treino</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Nome do Treino</Text>
						<TextInput
							style={styles.input}
							value={workoutName}
							onChangeText={setWorkoutName}
							placeholder="Digite o nome do treino"
							placeholderTextColor="#9CA3AF"
						/>
					</View>

					<View style={styles.switchContainer}>
						<View style={styles.switchLabel}>
							<Ionicons
								name={isActive ? 'checkmark-circle' : 'close-circle'}
								size={20}
								color={isActive ? '#10B981' : '#6B7280'}
							/>
							<Text style={styles.switchText}>
								{isActive ? 'Treino Ativo' : 'Treino Inativo'}
							</Text>
						</View>
						<Switch
							value={isActive}
							onValueChange={setIsActive}
							trackColor={{ false: '#E5E7EB', true: '#10B981' }}
							thumbColor="#FFFFFF"
						/>
					</View>

					<TouchableOpacity
						style={[styles.saveButton, saving && styles.buttonDisabled]}
						onPress={handleSaveWorkoutInfo}
						disabled={saving}
					>
						{saving ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<>
								<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
								<Text style={styles.saveButtonText}>Salvar Alterações</Text>
							</>
						)}
					</TouchableOpacity>
				</View>

				{/* Days Section */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Dias da Semana</Text>
					{availableDays.length > 0 && (
						<TouchableOpacity style={styles.addButton} onPress={handleOpenAddDayModal}>
							<Ionicons name="add-circle" size={20} color="#BBF246" />
							<Text style={styles.addButtonText}>Adicionar Dia</Text>
						</TouchableOpacity>
					)}
				</View>

				{workout.workoutDays.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
						<Text style={styles.emptyStateTitle}>Nenhum dia adicionado</Text>
						<Text style={styles.emptyStateText}>
							Adicione dias da semana para começar a criar o treino
						</Text>
					</View>
				) : (
					<View style={styles.daysList}>
						{workout.workoutDays.map((day) => (
							<View key={day.id}>
								<DayCard
									day={day}
									onPress={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
									onDelete={() => handleDeleteDayPress(day)}
								/>

								{/* Expanded exercises list */}
								{expandedDay === day.id && (
									<View style={styles.exercisesContainer}>
										{day.exercises.length === 0 ? (
											<View style={styles.noExercisesState}>
												<Ionicons name="barbell-outline" size={32} color="#9CA3AF" />
												<Text style={styles.noExercisesText}>
													Nenhum exercício adicionado
												</Text>
											</View>
										) : (
											day.exercises.map((exercise) => (
												<ExerciseCard
													key={exercise.id}
													exercise={exercise}
													onEdit={() => handleEditExercisePress(day, exercise)}
													onDelete={() => handleDeleteExercisePress(day, exercise)}
												/>
											))
										)}

										<TouchableOpacity
											style={styles.addExerciseButton}
											onPress={() => handleAddExercisePress(day)}
										>
											<Ionicons name="add-circle-outline" size={20} color="#BBF246" />
											<Text style={styles.addExerciseButtonText}>
												Adicionar Exercício
											</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
						))}
					</View>
				)}

				<View style={styles.bottomSpacing} />
			</ScrollView>

			{/* Add Day Modal */}
			<Modal
				visible={addDayModalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setAddDayModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Adicionar Dia</Text>
							<TouchableOpacity onPress={() => setAddDayModalVisible(false)}>
								<Ionicons name="close" size={24} color="#6B7280" />
							</TouchableOpacity>
						</View>

						<Text style={styles.modalSubtitle}>Selecione o dia da semana</Text>

						<View style={styles.daysGrid}>
							{availableDays.map((day) => (
								<TouchableOpacity
									key={day}
									style={[
										styles.dayOption,
										selectedDayOfWeek === day && styles.dayOptionSelected,
									]}
									onPress={() => setSelectedDayOfWeek(day)}
								>
									<Text
										style={[
											styles.dayOptionText,
											selectedDayOfWeek === day && styles.dayOptionTextSelected,
										]}
									>
										{DayOfWeekLabels[day]}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={styles.modalActions}>
							<TouchableOpacity
								style={styles.modalCancelButton}
								onPress={() => setAddDayModalVisible(false)}
							>
								<Text style={styles.modalCancelButtonText}>Cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalConfirmButton,
									addingDay && styles.buttonDisabled,
								]}
								onPress={handleAddDay}
								disabled={addingDay}
							>
								{addingDay ? (
									<ActivityIndicator size="small" color="#FFFFFF" />
								) : (
									<Text style={styles.modalConfirmButtonText}>Adicionar</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Add/Edit Exercise Modal */}
			<Modal
				visible={exerciseModalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setExerciseModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent, styles.exerciseModalContent]}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{exerciseModalMode === 'add' ? 'Adicionar Exercício' : 'Editar Exercício'}
							</Text>
							<TouchableOpacity onPress={() => setExerciseModalVisible(false)}>
								<Ionicons name="close" size={24} color="#6B7280" />
							</TouchableOpacity>
						</View>
						{/* Exercise Search (only for add mode) */}
						{exerciseModalMode === 'add' && (
							<>
								<View style={styles.searchContainer}>
									<Ionicons name="search" size={20} color="#9CA3AF" />
									<TextInput
										style={styles.searchInput}
										value={exerciseSearchQuery}
										onChangeText={handleSearchExercises}
										placeholder="Digite o nome do exercício (em inglês)"
										placeholderTextColor="#9CA3AF"
										autoFocus
									/>
									{exerciseSearchQuery.length > 0 && (
										<TouchableOpacity onPress={() => {
											setExerciseSearchQuery('');
											setSearchResults([]);
										}}>
											<Ionicons name="close-circle" size={20} color="#9CA3AF" />
										</TouchableOpacity>
									)}
								</View>

								{searching && (
									<View style={styles.searchingContainer}>
										<ActivityIndicator size="small" color="#BBF246" />
										<Text style={styles.searchingText}>Buscando exercícios...</Text>
									</View>
								)}

								{searchError && !searching && (
									<View style={styles.errorSearchState}>
										<Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
										<Text style={styles.errorSearchText}>{searchError}</Text>
									</View>
								)}

								{!searching && !searchError && exerciseSearchQuery.length >= 2 && searchResults.length === 0 && (
									<View style={styles.emptySearchState}>
										<Ionicons name="search-outline" size={48} color="#9CA3AF" />
										<Text style={styles.emptySearchText}>Nenhum exercício encontrado</Text>
										<Text style={styles.emptySearchHint}>Tente buscar em inglês (ex: "dumbbell", "press", "squat")</Text>
									</View>
								)}

								{!searching && searchResults.length > 0 && (
									<View style={styles.searchResultsContainer}>
										<Text style={styles.resultsCount}>
											{searchResults.length} exercício{searchResults.length > 1 ? 's' : ''} encontrado{searchResults.length > 1 ? 's' : ''}
										</Text>
										<ScrollView style={styles.searchResultsScroll} nestedScrollEnabled>
											{searchResults.map((item) => (
												<TouchableOpacity
													key={item.id}
													style={[
														styles.searchResultItem,
														selectedExerciseDb?.id === item.id &&
															styles.searchResultItemSelected,
													]}
													onPress={() => handleSelectExerciseDb(item)}
												>
													<Image
														source={ExerciseImageService.getImageProps(item.id, RESOLUTION.INSTRUCTOR)}
														style={styles.searchResultImage}
													/>
													<View style={styles.searchResultInfo}>
														<Text style={styles.searchResultName}>{item.name}</Text>
														<Text style={styles.searchResultMeta}>
															{item.bodyPart} • {item.equipment}
														</Text>
													</View>
													{selectedExerciseDb?.id === item.id && (
														<Ionicons
															name="checkmark-circle"
															size={24}
															color="#BBF246"
														/>
													)}
												</TouchableOpacity>
											))}
										</ScrollView>
									</View>
								)}

								{selectedExerciseDb && (
									<View style={styles.selectedExercisePreview}>
										<Text style={styles.previewLabel}>Exercício Selecionado:</Text>
										<View style={styles.previewCard}>
											<Image
												source={ExerciseImageService.getImageProps(selectedExerciseDb.id, RESOLUTION.INSTRUCTOR)}
												style={styles.previewImage}
											/>
											<View style={styles.previewInfo}>
												<Text style={styles.previewName}>
													{selectedExerciseDb.name}
												</Text>
												<Text style={styles.previewMeta}>
													{selectedExerciseDb.bodyPart} • {selectedExerciseDb.equipment}
												</Text>
											</View>
										</View>
									</View>
								)}
							</>
						)}

						{/* Exercise Configuration */}
						<ScrollView
							style={styles.exerciseConfigScroll}
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled
						>
							{(exerciseModalMode === 'edit' || selectedExerciseDb) && (
								<View style={styles.configSection}>
									<Text style={styles.modalSubtitle}>Configuração</Text>

									<View style={styles.formRow}>
										<View style={styles.formField}>
											<Text style={styles.formLabel}>Séries *</Text>
											<TextInput
												style={styles.formInput}
												value={exerciseSets}
												onChangeText={setExerciseSets}
												placeholder="3"
												keyboardType="default"
												placeholderTextColor="#9CA3AF"
											/>
										</View>

										<View style={styles.formField}>
											<Text style={styles.formLabel}>Repetições *</Text>
											<TextInput
												style={styles.formInput}
												value={exerciseReps}
												onChangeText={setExerciseReps}
												placeholder="10"
												keyboardType="default"
												placeholderTextColor="#9CA3AF"
											/>
										</View>
									</View>

									<View style={styles.formRow}>
										<View style={styles.formField}>
											<Text style={styles.formLabel}>Peso (kg)</Text>
											<TextInput
												style={styles.formInput}
												value={exerciseWeight}
												onChangeText={setExerciseWeight}
												placeholder="Opcional"
												keyboardType="numeric"
												placeholderTextColor="#9CA3AF"
											/>
										</View>

										<View style={styles.formField}>
											<Text style={styles.formLabel}>Descanso (s)</Text>
											<TextInput
												style={styles.formInput}
												value={exerciseRest}
												onChangeText={setExerciseRest}
												placeholder="60"
												keyboardType="numeric"
												placeholderTextColor="#9CA3AF"
											/>
										</View>
									</View>

									<View style={styles.formFieldFull}>
										<Text style={styles.formLabel}>Observações</Text>
										<TextInput
											style={[styles.formInput, styles.formTextArea]}
											value={exerciseNotes}
											onChangeText={setExerciseNotes}
											placeholder="Adicione observações sobre o exercício"
											placeholderTextColor="#9CA3AF"
											multiline
											numberOfLines={3}
											textAlignVertical="top"
										/>
									</View>
								</View>
							)}
						</ScrollView>

						<View style={styles.modalActions}>
							<TouchableOpacity
								style={styles.modalCancelButton}
								onPress={() => setExerciseModalVisible(false)}
							>
								<Text style={styles.modalCancelButtonText}>Cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalConfirmButton,
									savingExercise && styles.buttonDisabled,
								]}
								onPress={handleSaveExercise}
								disabled={savingExercise}
							>
								{savingExercise ? (
									<ActivityIndicator size="small" color="#FFFFFF" />
								) : (
									<Text style={styles.modalConfirmButtonText}>Salvar</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Delete Day Dialog */}
			<ConfirmDialog
				visible={deleteDayDialogVisible}
				title="Excluir Dia"
				message={`Tem certeza que deseja excluir ${dayToDelete ? DayOfWeekLabels[dayToDelete.dayOfWeek] : 'este dia'}? Todos os exercícios deste dia também serão excluídos.`}
				confirmText={deletingDay ? 'Excluindo...' : 'Excluir'}
				cancelText="Cancelar"
				confirmColor="#EF4444"
				icon="trash-outline"
				iconColor="#EF4444"
				onConfirm={handleDeleteDayConfirm}
				onCancel={() => {
					setDeleteDayDialogVisible(false);
					setDayToDelete(null);
				}}
			/>

			{/* Delete Exercise Dialog */}
			<ConfirmDialog
				visible={deleteExerciseDialogVisible}
				title="Excluir Exercício"
				message={`Tem certeza que deseja excluir ${exerciseToDelete?.exercise.name}?`}
				confirmText={deletingExercise ? 'Excluindo...' : 'Excluir'}
				cancelText="Cancelar"
				confirmColor="#EF4444"
				icon="trash-outline"
				iconColor="#EF4444"
				onConfirm={handleDeleteExerciseConfirm}
				onCancel={() => {
					setDeleteExerciseDialogVisible(false);
					setExerciseToDelete(null);
				}}
			/>
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
		fontSize: 28,
		fontWeight: '700',
		color: '#111827',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 16,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	input: {
		backgroundColor: '#F9FAFB',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: '#111827',
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		marginBottom: 16,
	},
	switchLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	switchText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#374151',
	},
	saveButton: {
		backgroundColor: '#BBF246',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		borderRadius: 8,
		gap: 8,
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
	buttonDisabled: {
		opacity: 0.5,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#111827',
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: '#EFF6FF',
	},
	addButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#3B82F6',
	},
	emptyState: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 40,
		alignItems: 'center',
		marginBottom: 16,
	},
	emptyStateTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#374151',
		marginTop: 16,
		marginBottom: 8,
	},
	emptyStateText: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
	},
	daysList: {
		marginBottom: 16,
	},
	exercisesContainer: {
		marginLeft: 16,
		marginRight: 16,
		marginBottom: 16,
		paddingLeft: 16,
		borderLeftWidth: 2,
		borderLeftColor: '#E5E7EB',
	},
	noExercisesState: {
		backgroundColor: '#F9FAFB',
		borderRadius: 12,
		padding: 24,
		alignItems: 'center',
		marginBottom: 12,
	},
	noExercisesText: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 8,
	},
	addExerciseButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#BBF246',
		borderStyle: 'dashed',
		backgroundColor: '#EFF6FF',
	},
	addExerciseButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#3B82F6',
	},
	bottomSpacing: {
		height: 24,
	},
	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 20,
		maxHeight: '80%',
	},
	exerciseModalContent: {
		maxHeight: '95%',
		height: '95%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E7EB',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
	},
	modalSubtitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 12,
	},
	daysGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 24,
	},
	dayOption: {
		flex: 1,
		minWidth: '30%',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: '#F3F4F6',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	dayOptionSelected: {
		backgroundColor: '#EFF6FF',
		borderColor: '#BBF246',
	},
	dayOptionText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#6B7280',
	},
	dayOptionTextSelected: {
		color: '#3B82F6',
		fontWeight: '600',
	},
	modalActions: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 16,
	},
	modalCancelButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		backgroundColor: '#F3F4F6',
		alignItems: 'center',
	},
	modalCancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
	},
	modalConfirmButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 8,
		backgroundColor: '#BBF246',
		alignItems: 'center',
	},
	modalConfirmButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	// Exercise modal styles
	exerciseConfigScroll: {
		flex: 1,
		marginTop: 12,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderWidth: 2,
		borderColor: '#BBF246',
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 16,
		shadowColor: '#BBF246',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 8,
		fontSize: 16,
		color: '#111827',
	},
	searchingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 32,
	},
	searchingText: {
		marginLeft: 8,
		fontSize: 16,
		color: '#6B7280',
	},
	emptySearchState: {
		alignItems: 'center',
		paddingVertical: 40,
		paddingHorizontal: 20,
	},
	emptySearchText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginTop: 12,
		marginBottom: 4,
	},
	emptySearchHint: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
	},
	errorSearchState: {
		alignItems: 'center',
		paddingVertical: 40,
		paddingHorizontal: 20,
		backgroundColor: '#FEF2F2',
		borderRadius: 12,
		marginBottom: 16,
	},
	errorSearchText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#EF4444',
		marginTop: 12,
		textAlign: 'center',
		lineHeight: 20,
	},
	searchResultsContainer: {
		flex: 1,
		marginBottom: 16,
	},
	resultsCount: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6B7280',
		marginBottom: 12,
	},
	searchResultsScroll: {
		maxHeight: 300,
	},
	searchResultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 14,
		backgroundColor: '#F9FAFB',
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: 'transparent',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	searchResultItemSelected: {
		backgroundColor: '#EFF6FF',
		borderColor: '#BBF246',
		shadowColor: '#BBF246',
		shadowOpacity: 0.2,
	},
	searchResultImage: {
		width: 70,
		height: 70,
		borderRadius: 10,
		backgroundColor: '#E5E7EB',
		marginRight: 14,
	},
	searchResultInfo: {
		flex: 1,
	},
	searchResultName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 6,
	},
	searchResultMeta: {
		fontSize: 13,
		color: '#6B7280',
		textTransform: 'capitalize',
	},
	selectedExercisePreview: {
		marginTop: 16,
		marginBottom: 16,
		paddingTop: 16,
		borderTopWidth: 2,
		borderTopColor: '#E5E7EB',
	},
	previewLabel: {
		fontSize: 15,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 12,
	},
	previewCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#EFF6FF',
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#BBF246',
		shadowColor: '#BBF246',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	previewImage: {
		width: 80,
		height: 80,
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		marginRight: 14,
	},
	previewInfo: {
		flex: 1,
	},
	previewName: {
		fontSize: 17,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 6,
	},
	previewMeta: {
		fontSize: 14,
		color: '#6B7280',
		textTransform: 'capitalize',
		fontWeight: '500',
	},
	configSection: {},
	formRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 12,
	},
	formField: {
		flex: 1,
	},
	formFieldFull: {
		marginBottom: 12,
	},
	formLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 6,
	},
	formInput: {
		backgroundColor: '#F9FAFB',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: '#111827',
	},
	formTextArea: {
		height: 80,
		paddingTop: 12,
	},
});
