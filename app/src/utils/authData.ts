import { UserAuthData } from "@/redux/authSlice/types";
import LocalStorage from "./localStore";

interface AuthData {
  token: string;
  user: UserAuthData | null;
}

export function getAuthData(): AuthData {
  if (typeof window === "undefined") {
    return { token: "", user: null };
  }

  const authString = LocalStorage.getItem(LocalStorage.AUTH_USER_DATA);
  if (!authString) {
    return { token: "", user: null };
  }

  try {
    const authData = JSON.parse(authString) as {
      token: string;
      user: UserAuthData;
    };
    return {
      token: authData.token,
      user: authData.user,
    };
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return { token: "", user: null };
  }
}

const defaultAuthData = getAuthData();

export const token = defaultAuthData.token;
export const user = defaultAuthData.user;

export function getAuthToken(): string {
  return getAuthData().token;
}

export function getAuthUser(): UserAuthData | null {
  return getAuthData().user;
}

export default defaultAuthData;
