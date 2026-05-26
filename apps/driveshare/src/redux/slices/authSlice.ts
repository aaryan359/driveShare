import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserAccount } from '@repo/shared';

interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    loginSuccess(state, action: PayloadAction<{ user: UserAccount; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateWalletBalance(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.walletBalanceINR = action.payload;
      }
    }
  },
});

export const { setLoading, loginSuccess, authFailed, logout, updateWalletBalance } = authSlice.actions;
export default authSlice.reducer;
