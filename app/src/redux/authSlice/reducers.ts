import { PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserAuthData } from "./types";
import LocalStorage from "@/utils/localStore";

export function loadAuthReducer(
  state: AuthState,
  action: PayloadAction<{ token: string; user: UserAuthData }>
) {
  const { token, user } = action.payload;
  state.token = token;
  state.user = user;

  LocalStorage.setItem(
    LocalStorage.AUTH_USER_DATA,
    JSON.stringify({ token, user })
  );
}

export function resetAuthReducer(state: AuthState) {
  state.token = null;
  state.user = null;

  LocalStorage.removeItem(LocalStorage.AUTH_USER_DATA);
}
