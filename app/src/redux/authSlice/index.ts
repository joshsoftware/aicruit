import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { loadAuthReducer, resetAuthReducer } from "./reducers";
import Cookies from "@/utils/cookies";

const loadInitialState = (): AuthState => {
  try {
    const storedAuth = Cookies.getItem(Cookies.AUTH_USER_DATA);
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
