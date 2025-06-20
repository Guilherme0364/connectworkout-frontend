import { Text } from 'react-native';
import React from 'react';
import { styles } from './style';

interface Props {
	text: string;
	color?: string;
	fontSize?: number;	
	textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'; 
	marginTop?: number;
	marginBottom?: number;
}

export const Title = ({ text, color, fontSize, textAlign, marginTop, marginBottom }: Props) => {
	return (
		<Text 
		style={[styles.text, { color: color }, { fontSize: fontSize }, { textAlign: textAlign }, { marginTop: marginTop }, {marginBottom: marginBottom}]}>
			{text}
		</Text>
	);
};

