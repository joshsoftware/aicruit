class LocalStorage {
  static AUTH_USER_DATA = "auth_user_data";

  private static isBrowserSide(): boolean {
    return typeof window !== "undefined";
  }

  static getItem(key: string): string | null {
    return LocalStorage.isBrowserSide()
      ? window.localStorage.getItem(key)
      : null;
  }

  static setItem(key: string, value: string): void {
    if (LocalStorage.isBrowserSide()) {
      window.localStorage.setItem(key, value);
    }
  }

  static removeItem(key: string): void {
    if (LocalStorage.isBrowserSide()) {
      window.localStorage.removeItem(key);
    }
  }
}

export default LocalStorage;
