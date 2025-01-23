export const UserRoles: Record<string, string> = {
  HR_ADMIN: "HR Admin",
  HR: "HR",
  DEFAULT: "/",
} as const;

export const UserRoutes: Record<string, string> = {
  [UserRoles.HR_ADMIN]: "/job-description",
  [UserRoles.HR]: "/analysis",
  DEFAULT: "/",
};
