import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { loadAuthReducer, resetAuthReducer } from "./reducers";

const initialState: AuthState = {
  token: null,
  user: null,
};

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
