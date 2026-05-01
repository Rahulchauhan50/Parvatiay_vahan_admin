import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthSession } from '../lib/api';
import { clearStoredSession, getStoredSession } from '../lib/api';

interface AuthState {
  session: AuthSession | null;
}

const initialState: AuthState = {
  session: getStoredSession(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = null;
      clearStoredSession();
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
