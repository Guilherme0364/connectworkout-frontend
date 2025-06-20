import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
	token: string | null;
	role: 'student' | 'instructor' | null;
	isLoading: boolean;
}

const initialState: AuthState = {
	token: null,
	role: null,
	isLoading: true,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
		},
		setRole(state, action: PayloadAction<'student' | 'instructor'>) {
			state.role = action.payload;
		},
		setIsLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
		logout(state) {
			state.token = null;
			state.role = null;
			state.isLoading = false;
		},
	},
});

export const { setToken, setRole, setIsLoading, logout } = authSlice.actions;
export default authSlice.reducer;
