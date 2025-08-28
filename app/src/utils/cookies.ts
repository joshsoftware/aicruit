import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const storeCookie = (key: string, token: string) => {
  return setCookie(key, token, {
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const fetchCookie = (key: string) => getCookie(key);

export const clearCookie = (key: string) => deleteCookie(key);
