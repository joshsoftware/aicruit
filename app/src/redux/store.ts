import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import LocalStorage from "@/utils/localStore";
import { isBrowserSide } from "@/utils/helpers"; // Adjust the import path as needed

// Load auth state from LocalStorage
const loadState = () => {
  if (!isBrowserSide()) {
    return undefined;
  }

  try {
    const storedAuth = LocalStorage.getItem(LocalStorage.AUTH_USER_DATA);
    return storedAuth ? JSON.parse(storedAuth) : undefined;
  } catch (error) {
    console.error("Failed to load auth state", error);
    return undefined;
  }
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: loadState() || { token: null, user: null },
    },
  });
};

// Only subscribe to store changes on client side
export const store = makeStore();

if (isBrowserSide()) {
  store.subscribe(() => {
    try {
      const state = store.getState().auth;
      LocalStorage.setItem(LocalStorage.AUTH_USER_DATA, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save auth state", error);
    }
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
