import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserAuthData } from "./types";
import { AUTH_USER_COOKIE } from "@/constants/constants";
import { clearCookie, storeCookie } from "@/utils/cookies";

export function loadAuthReducer(
  state: AuthState,
  action: PayloadAction<{ token: string; user: UserAuthData }>
) {
  const { token, user } = action.payload;
  state.token = token;
  state.user = user;

  storeCookie(AUTH_USER_COOKIE, JSON.stringify({ token, user }));
}

export function resetAuthReducer(state: AuthState) {
  state.token = null;
  state.user = null;

  clearCookie(AUTH_USER_COOKIE);
}
