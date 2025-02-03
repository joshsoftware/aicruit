import { PayloadAction } from "@reduxjs/toolkit";
import { UserAuthData, AuthState } from "./types";

export function loadAuthReducer(
  state: AuthState,
  action: PayloadAction<{
    token: string;
    user: UserAuthData;
  }>
) {
  const { token, user } = action.payload;

  state.token = token;
  state.user = user;
}

export function resetAuthReducer(state: AuthState) {
  state.token = null;
  state.user = null;
}
