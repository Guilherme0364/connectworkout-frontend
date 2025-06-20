import { View, Text, Pressable } from 'react-native'
import styles from './style'
import React, { forwardRef } from 'react'

interface Props {
	children?: React.ReactNode;
	color?: string;
	text?: string;
	onPress?: () => void;
	marginTop?: number;
	marginBottom?: number;
}

const Button = forwardRef<View, Props>(({ children, color, text, marginTop, marginBottom, onPress }, ref) => {
	return (
		<Pressable
			style={[styles.button, { backgroundColor: color }, { marginTop: marginTop }, { marginBottom: marginBottom }]}
			onPress={onPress}
		>
			{children ? (
				children  // Renderiza `children` se ele existir
			) : (
				<Text style={styles.buttonText}>{text}</Text>
			)}
		</Pressable>
	)
});

export { Button }