import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { AUTH_USER_COOKIE } from "@/constants/constants";
import { fetchCookie } from "@/utils/cookies";

// Load auth state from Cookies
const loadState = () => {
  try {
    const storedAuth = fetchCookie(AUTH_USER_COOKIE);
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

export default store;
