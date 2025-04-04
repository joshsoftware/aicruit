import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import LocalStorage from "@/utils/localStore";

// Load auth state from LocalStorage
const loadState = () => {
  try {
    const storedAuth = LocalStorage.getItem(LocalStorage.AUTH_USER_DATA);
    return storedAuth ? JSON.parse(storedAuth) : undefined;
  } catch (error) {
    console.error("Failed to load auth state", error);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: loadState() || { token: null, user: null },
  },
});

store.subscribe(() => {
  try {
    const state = store.getState().auth;
    LocalStorage.setItem(LocalStorage.AUTH_USER_DATA, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save auth state", error);
  }
});

export default store;
