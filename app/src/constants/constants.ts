export const MAX_FILE_SIZE_MB = 10;

export enum UserRoles {
  SUPER_ADMIN = "Super Admin",
  HR_ADMIN = "HR Admin",
  HR = "HR",
  DEFAULT = "/",
}

export const UserRoutes: Record<string, string> = {
  [UserRoles.HR_ADMIN]: "/job-description",
  [UserRoles.HR]: "/job-description",
  DEFAULT: "/",
};
