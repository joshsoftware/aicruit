class LocalStorage {
  static AUTH_USER_DATA = "auth_user_data";

  static setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  static getItem(key: string) {
    return localStorage.getItem(key);
  }

  static removeItem(key: string) {
    return localStorage.removeItem(key);
  }

  static removeAll() {
    return localStorage.clear();
  }
}

export default LocalStorage;
