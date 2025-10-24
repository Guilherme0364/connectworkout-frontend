import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../styles/theme';

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: keyof typeof Ionicons.glyphMap;
	color: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
					<Ionicons name={icon} size={24} color={color} />
				</View>
				{trend && (
					<View style={styles.trendContainer}>
						<Ionicons
							name={trend.isPositive ? 'trending-up' : 'trending-down'}
							size={16}
							color={trend.isPositive ? Theme.colors.success : Theme.colors.error}
						/>
						<Text
							style={[
								styles.trendText,
								{ color: trend.isPositive ? Theme.colors.success : Theme.colors.error },
							]}
						>
							{Math.abs(trend.value)}%
						</Text>
					</View>
				)}
			</View>
			<Text style={styles.value}>{value}</Text>
			<Text style={styles.title}>{title}</Text>
			{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Theme.colors.surface,
		borderRadius: 12,
		padding: 16,
		flex: 1,
		marginHorizontal: 4,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	trendContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	trendText: {
		fontSize: 12,
		fontWeight: '600',
		marginLeft: 2,
	},
	value: {
		fontSize: 24,
		fontWeight: '700',
		color: Theme.colors.textPrimary,
		marginBottom: 4,
	},
	title: {
		fontSize: 14,
		fontWeight: '500',
		color: Theme.colors.textSecondary,
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 12,
		color: Theme.colors.textTertiary,
	},
});

export default StatCard;