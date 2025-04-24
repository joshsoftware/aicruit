import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserAuthData } from "./types";
import Cookies from "@/utils/cookies";

export function loadAuthReducer(
  state: AuthState,
  action: PayloadAction<{ token: string; user: UserAuthData }>
) {
  const { token, user } = action.payload;
  state.token = token;
  state.user = user;

  Cookies.setItem(Cookies.AUTH_USER_DATA, JSON.stringify({ token, user }));
}

export function resetAuthReducer(state: AuthState) {
  state.token = null;
  state.user = null;

  Cookies.deleteItem(Cookies.AUTH_USER_DATA);
}
