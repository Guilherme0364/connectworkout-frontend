import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityCardProps {
	title: string;
	subtitle: string;
	time?: string;
	status: 'completed' | 'pending' | 'in-progress' | 'cancelled';
	icon: keyof typeof Ionicons.glyphMap;
	onPress?: () => void;
}

function ActivityCard({
	title,
	subtitle,
	time,
	status,
	icon,
	onPress,
}: ActivityCardProps) {
	const getStatusColor = () => {
		switch (status) {
			case 'completed':
				return '#10B981';
			case 'pending':
				return '#F59E0B';
			case 'in-progress':
				return '#3B82F6';
			case 'cancelled':
				return '#EF4444';
			default:
				return '#6B7280';
		}
	};

	const getStatusText = () => {
		switch (status) {
			case 'completed':
				return 'Completed';
			case 'pending':
				return 'Pending';
			case 'in-progress':
				return 'In Progress';
			case 'cancelled':
				return 'Cancelled';
			default:
				return 'Unknown';
		}
	};

	const statusColor = getStatusColor();

	const CardContent = (
		<View style={styles.container}>
			<View style={styles.leftContent}>
				<View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
					<Ionicons name={icon} size={20} color={statusColor} />
				</View>
				<View style={styles.textContent}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{subtitle}</Text>
					{time && <Text style={styles.time}>{time}</Text>}
				</View>
			</View>
			<View style={styles.rightContent}>
				<View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
					<Text style={[styles.statusText, { color: statusColor }]}>
						{getStatusText()}
					</Text>
				</View>
				{onPress && (
					<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
				)}
			</View>
		</View>
	);

	if (onPress) {
		return (
			<Pressable onPress={onPress} style={styles.pressableContainer}>
				{CardContent}
			</Pressable>
		);
	}

	return CardContent;
}

const styles = StyleSheet.create({
	pressableContainer: {
		marginBottom: 12,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 3,
	},
	leftContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	textContent: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 14,
		color: '#6B7280',
		marginBottom: 2,
	},
	time: {
		fontSize: 12,
		color: '#9CA3AF',
	},
	rightContent: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		marginRight: 8,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
});

export default ActivityCard;