import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { loadAuthReducer, resetAuthReducer } from "./reducers";
import { fetchCookie } from "@/utils/cookies";
import { AUTH_USER_COOKIE } from "@/constants/constants";

const loadInitialState = (): AuthState => {
  try {
    const storedAuth = fetchCookie(AUTH_USER_COOKIE);
    return storedAuth
      ? JSON.parse(storedAuth as string)
      : { token: null, user: null };
  } catch (error) {
    console.error("Failed to load auth state", error);
    return { token: null, user: null };
  }
};

const initialState: AuthState = loadInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadAuth: loadAuthReducer,
    resetAuth: resetAuthReducer,
  },
});

export const { loadAuth, resetAuth } = authSlice.actions;
export default authSlice.reducer;
