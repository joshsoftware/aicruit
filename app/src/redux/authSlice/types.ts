export interface AuthState {
  token: string | null;
  user: UserAuthData | null;
}

export interface UserAuthData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number | null;
  comapanyId: number | null;
  roleName: string;
}
