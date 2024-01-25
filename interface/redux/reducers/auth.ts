import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean,
  userId: string,
  email: string
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: '',
  email: '',
}

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      return initialState
    },
    login: (state, action: PayloadAction<{ userId: string, email: string }>) => {
      return {
        isAuthenticated: true,
        userId: action.payload.userId,
        email: action.payload.email,
      }
    }
  }
});

export const { login, logout } = auth.actions;
export default auth.reducer;