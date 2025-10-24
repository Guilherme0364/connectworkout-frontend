/**
 * Select Student for Workout Creation Screen
 *
 * Shows all students as selectable cards
 * Coach taps a student to create a new workout for them
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
	RefreshControl,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EmptyState from '../../components/EmptyState';
import { InstructorService } from '../../services';
import { handleApiError } from '../../utils/errorHandler';
import type { StudentSummaryDto } from '../../types/api.types';

export default function SelectStudentWorkout() {
	const router = useRouter();
	const [students, setStudents] = useState<StudentSummaryDto[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/(private)/(coach)/(tabs)/students');
		}
	};

	// Load students on mount
	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async (isRefreshing = false) => {
		try {
			if (isRefreshing) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}

			const data = await InstructorService.getStudents();
			setStudents(data);
		} catch (error) {
			handleApiError(error, 'Não foi possível carregar os alunos');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const onRefresh = () => {
		fetchStudents(true);
	};

	const handleSelectStudent = (student: StudentSummaryDto) => {
		console.log('🔘 Student selected for workout creation:', student.name);
		router.push(`/(private)/(coach)/(workout)/create-workout?studentId=${student.id}`);
	};

	// Filter students by search query
	const filteredStudents = students.filter(
		(student) =>
			student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			student.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#BBF246" />
					<Text style={styles.loadingText}>Carregando alunos...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity style={styles.backButton} onPress={handleBack}>
						<Ionicons name="arrow-back" size={24} color="#111827" />
					</TouchableOpacity>
					<View style={styles.headerContent}>
						<Text style={styles.title}>Criar Treino</Text>
						<Text style={styles.subtitle}>Selecione um aluno</Text>
					</View>
				</View>

				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar aluno..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholderTextColor="#9CA3AF"
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery('')}>
							<Ionicons name="close-circle" size={20} color="#9CA3AF" />
						</TouchableOpacity>
					)}
				</View>

				{/* Students List */}
				{filteredStudents.length === 0 ? (
					<EmptyState
						icon="people-outline"
						title={
							searchQuery
								? 'Nenhum aluno encontrado'
								: 'Nenhum aluno cadastrado'
						}
						description={
							searchQuery
								? 'Tente ajustar sua busca'
								: 'Adicione alunos para poder criar treinos'
						}
					/>
				) : (
					<View style={styles.studentsList}>
						{filteredStudents.map((student) => (
							<TouchableOpacity
								key={student.id}
								style={styles.studentCard}
								onPress={() => handleSelectStudent(student)}
								activeOpacity={0.7}
							>
								<View style={styles.studentContent}>
									{/* Avatar */}
									<View style={styles.avatar}>
										<Ionicons name="person" size={28} color="#BBF246" />
									</View>

									{/* Student Info */}
									<View style={styles.studentInfo}>
										<Text style={styles.studentName}>{student.name}</Text>
										<Text style={styles.studentEmail}>{student.email}</Text>

										{/* Active Workout Badge */}
										{student.activeWorkoutId > 0 ? (
											<View style={styles.activeWorkoutBadge}>
												<Ionicons name="checkmark-circle" size={14} color="#10B981" />
												<Text style={styles.activeWorkoutText}>
													Treino ativo: {student.activeWorkoutName}
												</Text>
											</View>
										) : (
											<View style={styles.noWorkoutBadge}>
												<Ionicons name="alert-circle-outline" size={14} color="#F59E0B" />
												<Text style={styles.noWorkoutText}>Sem treino ativo</Text>
											</View>
										)}
									</View>

									{/* Chevron */}
									<Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
								</View>
							</TouchableOpacity>
						))}
					</View>
				)}

				<View style={styles.bottomSpacing} />
			</ScrollView>
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
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 16,
		color: '#6B7280',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	searchIcon: {
		marginRight: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: '#111827',
	},
	studentsList: {
		marginBottom: 16,
	},
	studentCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	studentContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#EFF6FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	studentInfo: {
		flex: 1,
	},
	studentName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 4,
	},
	studentEmail: {
		fontSize: 14,
		color: '#6B7280',
		marginBottom: 8,
	},
	activeWorkoutBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		alignSelf: 'flex-start',
		backgroundColor: '#10B98115',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	activeWorkoutText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#10B981',
	},
	noWorkoutBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		alignSelf: 'flex-start',
		backgroundColor: '#F59E0B15',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	noWorkoutText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#F59E0B',
	},
	bottomSpacing: {
		height: 24,
	},
});
