import { Slot } from 'expo-router';
import { StudentProvider } from '../contexts/StudentContext';

export default function PrivateLayout() {
	return (
		<StudentProvider>
			<Slot />
		</StudentProvider>
	);
}
