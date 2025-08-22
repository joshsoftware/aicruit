export const enum ApiRoute {
  SignUp = "/users",
  Login = "/users/sign_in",
  JobDescriptions = "/job_descriptions",
  JobDescriptionsUpload = "/job_descriptions/upload",
  PublishedJobDescriptions = "/job_descriptions/published",
  ParseJobDescription = "/parse-job-description",
  // Resume endpoints
  Resumes = "/resumes",
  ResumeUpload = "/resumes/upload",
  ParseResume = "/parse-resume",
}

export const BrowserRoute = {
  Home: "/",
  SignIn: "/signin",
  SignUp: "/signup",
  Analysis: "/analysis",
};
