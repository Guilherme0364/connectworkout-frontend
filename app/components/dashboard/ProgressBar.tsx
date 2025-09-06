import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
	value: number; // 0-100
	maxValue?: number;
	label?: string;
	color?: string;
	showPercentage?: boolean;
	height?: number;
}

function ProgressBar({
	value,
	maxValue = 100,
	label,
	color = '#3B82F6',
	showPercentage = true,
	height = 8,
}: ProgressBarProps) {
	const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

	return (
		<View style={styles.container}>
			{label && (
				<View style={styles.labelContainer}>
					<Text style={styles.label}>{label}</Text>
					{showPercentage && (
						<Text style={[styles.percentage, { color }]}>
							{Math.round(percentage)}%
						</Text>
					)}
				</View>
			)}
			<View style={[styles.progressContainer, { height }]}>
				<View
					style={[
						styles.progressBar,
						{
							width: `${percentage}%`,
							backgroundColor: color,
						},
					]}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 8,
	},
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	label: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	percentage: {
		fontSize: 14,
		fontWeight: '600',
	},
	progressContainer: {
		backgroundColor: '#E5E7EB',
		borderRadius: 4,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		borderRadius: 4,
	},
});

export default ProgressBar;