import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import Cookies from "@/utils/cookies";

// Load auth state from Cookies
const loadState = () => {
  try {
    const storedAuth = Cookies.getItem(Cookies.AUTH_USER_DATA);
    return storedAuth ? JSON.parse(storedAuth as string) : undefined;
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
    Cookies.setItem(Cookies.AUTH_USER_DATA, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save auth state", error);
  }
});

export default store;
