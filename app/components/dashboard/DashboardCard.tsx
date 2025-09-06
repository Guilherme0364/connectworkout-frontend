import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardCardProps {
	title: string;
	subtitle?: string;
	value?: string | number;
	icon?: keyof typeof Ionicons.glyphMap;
	color?: string;
	onPress?: () => void;
	children?: React.ReactNode;
}

function DashboardCard({
	title,
	subtitle,
	value,
	icon,
	color = '#3B82F6',
	onPress,
	children,
}: DashboardCardProps) {
	const CardContent = (
		<View style={[styles.card, onPress && styles.pressableCard]}>
			<View style={styles.cardHeader}>
				<View style={styles.cardTitleContainer}>
					{icon && (
						<View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
							<Ionicons name={icon} size={20} color={color} />
						</View>
					)}
					<View style={styles.textContainer}>
						<Text style={styles.cardTitle}>{title}</Text>
						{subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
					</View>
				</View>
				{value && <Text style={[styles.cardValue, { color }]}>{value}</Text>}
			</View>
			{children && <View style={styles.cardContent}>{children}</View>}
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
		marginBottom: 16,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	pressableCard: {
		marginBottom: 0,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	cardTitleContainer: {
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
	textContainer: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#111827',
		marginBottom: 2,
	},
	cardSubtitle: {
		fontSize: 14,
		color: '#6B7280',
	},
	cardValue: {
		fontSize: 18,
		fontWeight: '700',
	},
	cardContent: {
		marginTop: 8,
	},
});

export default DashboardCard;