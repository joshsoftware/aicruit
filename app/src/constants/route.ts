/**
 * ApiRoute: constants for backend API endpoints only (Rails/Python services).
 * - These are appended to axios baseURL and used exclusively by services/apis.
 * - Do NOT use these for next/router navigation or <Link/> hrefs.
 */
export const enum ApiRoute {
  SignUp = "/users",
  Login = "/users/sign_in",
  JobDescriptions = "/job_descriptions",
  JobDescriptionsUpload = "/job_descriptions/upload",
  PublishedJobDescriptions = "/job_descriptions/published",
  ParseJobDescription = "/parse-job-description",
  ApplicantResumesSuffix = "/applicant_resumes",
  // Resume endpoints
  Resumes = "/resumes",
  ResumeUpload = "/resumes/upload",
  ParseResume = "/parse-resume",
}


/**
 * BrowserRoute: client-side routes for Next.js app router (app/ directory).
 * - Use these with router.push(), Link href, etc.
 * - Dynamic segments use the [param] syntax to mirror the folder structure.
 *   Example: BrowserRoute.JobDescriptionDetails => "/job-description/[job_description_id]"
 *   Build a concrete path at call-site: `/job-description/${id}`
 */
export const BrowserRoute = {
  Home: "/",
  SignIn: "/signin",
  SignUp: "/signup",
  Analysis: "/analysis",
  // Job description pages
  JobDescription: "/job-description",
  JobDescriptionDetails: "/job-description/[job_description_id]",
  JobDescriptionUploadResume: "/job-description/[job_description_id]/upload-resume",
  JobDescriptionApplicants: "/job-description/[job_description_id]/applicants",
};
