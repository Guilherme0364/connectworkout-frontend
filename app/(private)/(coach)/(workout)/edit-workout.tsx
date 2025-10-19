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

	const loadWorkout = async () => {
		try {
			setLoading(true);
			const data = await WorkoutService.getWorkoutDetails(Number(workoutId));
			setWorkout(data);
			setWorkoutName(data.name);
			setIsActive(data.isActive);
		} catch (error) {
			handleApiError(error, 'N�o foi poss�vel carregar o treino');
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
				window.alert('O nome do treino � obrigat�rio');
			} else {
				Alert.alert('Erro', 'O nome do treino � obrigat�rio');
			}
			return;
		}

		try {
			setSaving(true);
			await WorkoutService.updateWorkout(Number(workoutId), {
				name: workoutName.trim(),
				isActive,
			});
			showSuccess('Sucesso', 'Treino atualizado com sucesso');
			loadWorkout(); // Reload to get updated data
		} catch (error) {
			handleApiError(error, 'N�o foi poss�vel atualizar o treino');
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
			handleApiError(error, 'N�o foi poss�vel adicionar o dia');
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
			showSuccess('Sucesso', 'Dia exclu�do com sucesso');
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'N�o foi poss�vel excluir o dia');
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
		setExerciseSets('3');
		setExerciseReps('10');
		setExerciseWeight('');
		setExerciseRest('60');
		setExerciseNotes('');
		setExerciseModalVisible(true);
	};

	const handleSearchExercises = async (query: string) => {
		setExerciseSearchQuery(query);

		if (query.trim().length < 2) {
			setSearchResults([]);
			return;
		}

		try {
			setSearching(true);
			const results = await ExerciseService.searchExercises(query.trim());
			setSearchResults(results);
		} catch (error) {
			console.error('Search exercises error:', error);
			setSearchResults([]);
		} finally {
			setSearching(false);
		}
	};

	const handleSelectExerciseDb = (exercise: ExerciseDbModel) => {
		setSelectedExerciseDb(exercise);
	};

	const handleSaveExercise = async () => {
		if (!selectedDayForExercise) return;

		if (exerciseModalMode === 'add' && !selectedExerciseDb) {
			if (Platform.OS === 'web') {
				window.alert('Selecione um exerc�cio');
			} else {
				Alert.alert('Erro', 'Selecione um exerc�cio');
			}
			return;
		}

		if (!exerciseSets.trim() || !exerciseReps.trim()) {
			if (Platform.OS === 'web') {
				window.alert('S�ries e repeti��es s�o obrigat�rias');
			} else {
				Alert.alert('Erro', 'S�ries e repeti��es s�o obrigat�rias');
			}
			return;
		}

		try {
			setSavingExercise(true);

			if (exerciseModalMode === 'add' && selectedExerciseDb) {
				// Add new exercise
				await WorkoutService.addExercise(
					Number(workoutId),
					selectedDayForExercise.id,
					{
						exerciseDbId: selectedExerciseDb.id,
						name: selectedExerciseDb.name,
						bodyPart: selectedExerciseDb.bodyPart,
						equipment: selectedExerciseDb.equipment,
						gifUrl: selectedExerciseDb.gifUrl,
						sets: exerciseSets.trim(),
						repetitions: exerciseReps.trim(),
						weight: exerciseWeight.trim() ? Number(exerciseWeight) : undefined,
						restSeconds: exerciseRest.trim() ? Number(exerciseRest) : undefined,
						notes: exerciseNotes.trim() || undefined,
					}
				);
				showSuccess('Sucesso', 'Exerc�cio adicionado com sucesso');
			} else if (exerciseModalMode === 'edit' && selectedExercise) {
				// Update existing exercise
				await WorkoutService.updateExercise(
					Number(workoutId),
					selectedDayForExercise.id,
					selectedExercise.id,
					{
						sets: exerciseSets.trim(),
						repetitions: exerciseReps.trim(),
						weight: exerciseWeight.trim() ? Number(exerciseWeight) : undefined,
						restSeconds: exerciseRest.trim() ? Number(exerciseRest) : undefined,
						notes: exerciseNotes.trim() || undefined,
					}
				);
				showSuccess('Sucesso', 'Exerc�cio atualizado com sucesso');
			}

			setExerciseModalVisible(false);
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'N�o foi poss�vel salvar o exerc�cio');
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
			showSuccess('Sucesso', 'Exerc�cio exclu�do com sucesso');
			loadWorkout();
		} catch (error) {
			handleApiError(error, 'N�o foi poss�vel excluir o exerc�cio');
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
					<ActivityIndicator size="large" color="#3B82F6" />
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
					<Text style={styles.cardTitle}>Informa��es do Treino</Text>

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
								<Text style={styles.saveButtonText}>Salvar Altera��es</Text>
							</>
						)}
					</TouchableOpacity>
				</View>

				{/* Days Section */}
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Dias da Semana</Text>
					{availableDays.length > 0 && (
						<TouchableOpacity style={styles.addButton} onPress={handleOpenAddDayModal}>
							<Ionicons name="add-circle" size={20} color="#3B82F6" />
							<Text style={styles.addButtonText}>Adicionar Dia</Text>
						</TouchableOpacity>
					)}
				</View>

				{workout.workoutDays.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
						<Text style={styles.emptyStateTitle}>Nenhum dia adicionado</Text>
						<Text style={styles.emptyStateText}>
							Adicione dias da semana para come�ar a criar o treino
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
													Nenhum exerc�cio adicionado
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
											<Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
											<Text style={styles.addExerciseButtonText}>
												Adicionar Exerc�cio
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
								{exerciseModalMode === 'add' ? 'Adicionar Exerc�cio' : 'Editar Exerc�cio'}
							</Text>
							<TouchableOpacity onPress={() => setExerciseModalVisible(false)}>
								<Ionicons name="close" size={24} color="#6B7280" />
							</TouchableOpacity>
						</View>

						<ScrollView style={styles.exerciseModalScroll} showsVerticalScrollIndicator={false}>
							{/* Exercise Search (only for add mode) */}
							{exerciseModalMode === 'add' && (
								<View style={styles.searchSection}>
									<Text style={styles.modalSubtitle}>Buscar Exerc�cio</Text>
									<View style={styles.searchContainer}>
										<Ionicons name="search" size={20} color="#9CA3AF" />
										<TextInput
											style={styles.searchInput}
											value={exerciseSearchQuery}
											onChangeText={handleSearchExercises}
											placeholder="Digite o nome do exerc�cio"
											placeholderTextColor="#9CA3AF"
										/>
									</View>

									{searching && (
										<View style={styles.searchingContainer}>
											<ActivityIndicator size="small" color="#3B82F6" />
											<Text style={styles.searchingText}>Buscando...</Text>
										</View>
									)}

									{!searching && searchResults.length > 0 && (
										<FlatList
											data={searchResults}
											keyExtractor={(item) => item.id}
											style={styles.searchResults}
											renderItem={({ item }) => (
												<TouchableOpacity
													style={[
														styles.searchResultItem,
														selectedExerciseDb?.id === item.id &&
															styles.searchResultItemSelected,
													]}
													onPress={() => handleSelectExerciseDb(item)}
												>
													<Image
														source={{ uri: item.gifUrl }}
														style={styles.searchResultImage}
													/>
													<View style={styles.searchResultInfo}>
														<Text style={styles.searchResultName}>{item.name}</Text>
														<Text style={styles.searchResultMeta}>
															{item.bodyPart} " {item.equipment}
														</Text>
													</View>
													{selectedExerciseDb?.id === item.id && (
														<Ionicons
															name="checkmark-circle"
															size={24}
															color="#3B82F6"
														/>
													)}
												</TouchableOpacity>
											)}
										/>
									)}

									{selectedExerciseDb && (
										<View style={styles.selectedExercisePreview}>
											<Text style={styles.previewLabel}>Exerc�cio Selecionado:</Text>
											<View style={styles.previewCard}>
												<Image
													source={{ uri: selectedExerciseDb.gifUrl }}
													style={styles.previewImage}
												/>
												<View style={styles.previewInfo}>
													<Text style={styles.previewName}>
														{selectedExerciseDb.name}
													</Text>
													<Text style={styles.previewMeta}>
														{selectedExerciseDb.bodyPart} "{' '}
														{selectedExerciseDb.equipment}
													</Text>
												</View>
											</View>
										</View>
									)}
								</View>
							)}

							{/* Exercise Configuration */}
							{(exerciseModalMode === 'edit' || selectedExerciseDb) && (
								<View style={styles.configSection}>
									<Text style={styles.modalSubtitle}>Configura��o</Text>

									<View style={styles.formRow}>
										<View style={styles.formField}>
											<Text style={styles.formLabel}>S�ries *</Text>
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
											<Text style={styles.formLabel}>Repeti��es *</Text>
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
										<Text style={styles.formLabel}>Observa��es</Text>
										<TextInput
											style={[styles.formInput, styles.formTextArea]}
											value={exerciseNotes}
											onChangeText={setExerciseNotes}
											placeholder="Adicione observa��es sobre o exerc�cio"
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
				message={`Tem certeza que deseja excluir ${dayToDelete ? DayOfWeekLabels[dayToDelete.dayOfWeek] : 'este dia'}? Todos os exerc�cios deste dia tamb�m ser�o exclu�dos.`}
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
				title="Excluir Exerc�cio"
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
		backgroundColor: '#3B82F6',
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
		borderColor: '#3B82F6',
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
		maxHeight: '90%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
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
		borderColor: '#3B82F6',
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
		backgroundColor: '#3B82F6',
		alignItems: 'center',
	},
	modalConfirmButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	// Exercise modal styles
	exerciseModalScroll: {
		maxHeight: '70%',
	},
	searchSection: {
		marginBottom: 24,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 8,
		paddingHorizontal: 12,
		marginBottom: 12,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 8,
		fontSize: 16,
		color: '#111827',
	},
	searchingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
	},
	searchingText: {
		marginLeft: 8,
		fontSize: 14,
		color: '#6B7280',
	},
	searchResults: {
		maxHeight: 200,
		marginBottom: 12,
	},
	searchResultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		backgroundColor: '#F9FAFB',
		borderRadius: 8,
		marginBottom: 8,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	searchResultItemSelected: {
		backgroundColor: '#EFF6FF',
		borderColor: '#3B82F6',
	},
	searchResultImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
		backgroundColor: '#E5E7EB',
		marginRight: 12,
	},
	searchResultInfo: {
		flex: 1,
	},
	searchResultName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 4,
	},
	searchResultMeta: {
		fontSize: 12,
		color: '#6B7280',
		textTransform: 'capitalize',
	},
	selectedExercisePreview: {
		marginTop: 16,
	},
	previewLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	previewCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		backgroundColor: '#EFF6FF',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#3B82F6',
	},
	previewImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: '#E5E7EB',
		marginRight: 12,
	},
	previewInfo: {
		flex: 1,
	},
	previewName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 4,
	},
	previewMeta: {
		fontSize: 14,
		color: '#6B7280',
		textTransform: 'capitalize',
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
