import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { loadAuthReducer, resetAuthReducer } from "./reducers";
import LocalStorage from "@/utils/localStore";

const loadInitialState = (): AuthState => {
  try {
    const storedAuth = LocalStorage.getItem(LocalStorage.AUTH_USER_DATA);
    return storedAuth ? JSON.parse(storedAuth) : { token: null, user: null };
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
