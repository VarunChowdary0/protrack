import { User } from '@/types/userTypes';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null,
  isAuthenticated: boolean,
  accessToken: string | null,
  refreshToken: string | null,
}

const initialState:AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
    },
    updateTokens: (state, action) => {
      const { access_token, refresh_token } = action.payload;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
    },  
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('refresh_token')
      window.location.href='/login'
    },
  },
});

export const { loginSuccess, logoutSuccess, updateTokens } = authSlice.actions;
export default authSlice.reducer;