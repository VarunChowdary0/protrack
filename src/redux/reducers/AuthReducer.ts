import { User } from '@/types/userTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
