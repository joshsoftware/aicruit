import { setCookie, getCookie, deleteCookie } from "cookies-next";

class Cookies {
  static AUTH_USER_DATA = "auth_user_data";

  static setItem(key: string, token: string) {
    return setCookie(key, token, {
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  static getItem(key: string) {
    return getCookie(key);
  }

  static deleteItem(key: string) {
    return deleteCookie(key);
  }
}

export default Cookies;
