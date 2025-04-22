import { store } from "@/redux/store";
import LocalStorage from "./localStore";
import { resetAuth } from "@/redux/authSlice";

export function isBrowserSide() {
  return typeof window !== "undefined";
}

export const formatDate = (isoString?: string): string => {
  if (!isoString) return "N/A";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
};

export function logout() {
  store.dispatch(resetAuth());
  LocalStorage.removeItem(LocalStorage.AUTH_USER_DATA);
}
