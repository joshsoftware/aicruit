export const MAX_FILE_SIZE_MB = 10;

export enum UserRoles {
  SUPER_ADMIN = "Super Admin",
  HR_ADMIN = "HR Admin",
  HR = "HR",
  CANDIDATE = "Candidate",
  DEFAULT = "/",
}

export const UserRoutes: Record<string, string> = {
  [UserRoles.HR_ADMIN]: "/job-description",
  [UserRoles.HR]: "/job-description",
  [UserRoles.CANDIDATE]: "/published-job-descriptions",
  DEFAULT: "/",
};

export const PUBLIC_ROUTES = ["/", "/signin", "/signup", "/published-job-descriptions"];

export const isPublicJobDescriptionRoute = (pathname: string): boolean => {
  return /^\/job-description\/\d+$/.test(pathname);
};

export const isPublicUploadResumeRoute = (pathname: string): boolean => {
  return /^\/job-description\/\d+\/upload-resume$/.test(pathname);
};

export const AUTH_USER_COOKIE = "auth_user_data";

export const RESUME_STATUS_CLASSES = {
  PROCESSING: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800",
  APPLIED: "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800",
  SHORTLISTED: "px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800",
  REJECTED: "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800",
  HIRED: "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800",
  DEFAULT: "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800",
};
