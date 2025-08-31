import { ApiRoute } from "@/constants/route";
import store from "@/redux/store";
import axiosInstance, { pythonAxiosInstance } from "@/utils/axios";

export interface Resume {
  id: number;
  user_id: number;
  company_id: number;
  job_description_id: number;
  referred_by_id: number;
  candidate_email: string;
  candidate_first_name: string;
  candidate_last_name: string;
  primary_skills: string[];
  secondary_skills: string[];
  domain_expertise: string[];
  matching_skills: string[];
  missing_skills: string[];
  years_of_experience: number;
  link_to_file: string;
  referred_by: string;
  status: string;
  rating: string;
  candidate_mobile_no: string;
}

export interface GetResumesListResponse {
  success: boolean;
  data: Resume[];
  message: string;
}

export interface GetResumesListParams {
  job_description_id?: number;
  status?: string;
  searchKey?: string;
  sortKey?: string;
}

export interface GetResumeByIdResponse {
  success: boolean;
  data: Resume;
  message: string;
}

export interface PostResumeUploadResponse {
    success: boolean;
    data: any;
    message?: string;
}

export interface ParseResumeResponse {
    success: boolean;
    data: { parsed_data: any; title?: string };
    message?: string;
}

export interface CreateResumeVariables {
    job_description_id: number;
    parsed_data?: any;
}

export async function getResumesList({
  job_description_id,
  searchKey,
  sortKey,
}: GetResumesListParams): Promise<GetResumesListResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get(
    ApiRoute.Resumes,
    {
      params: {
        job_description_id: job_description_id,
        search_key: searchKey,
        sort_key: sortKey,
      },
      headers: { Authorization: token },
    }
  );

  return response.data as GetResumesListResponse;
}

export async function getResumeById(
  id: number
): Promise<GetResumeByIdResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get(
    `${ApiRoute.Resumes}/${id}`,
    {
      headers: { Authorization: token },
    }
  );
  return response.data as GetResumeByIdResponse;
}

export async function postResumeFileUpload(payload: {
    job_description_id: number;
    resume_file: File;
    candidate_email: string;
    candidate_first_name: string;
    candidate_last_name: string;
    company_id: string;
}): Promise<PostResumeUploadResponse> {
    const formData = new FormData();
    formData.append("job_description_id", String(payload.job_description_id));
    // rename to pdf_file as per requirement
    formData.append("pdf_file", payload.resume_file);

    // take values directly from user input
    formData.append("candidate_email", payload.candidate_email);
    formData.append("candidate_first_name", payload.candidate_first_name);
    formData.append("candidate_last_name", payload.candidate_last_name);
    formData.append("company_id", payload.company_id);

    const token = store.getState().auth.token;
    const response = await axiosInstance.post(ApiRoute.ResumeUpload, formData, {
        headers: { Authorization: token },
    });
    return response.data;
}

export async function parseResumeFromUrl(payload: { file_url: string }): Promise<ParseResumeResponse> {
    const formData = new FormData();
    formData.append("file_url", payload.file_url);
    const response = await pythonAxiosInstance.post(ApiRoute.ParseResume, formData);
    return response.data;
}

export async function createResumeFromParsed(variables: CreateResumeVariables) {
    const token = store.getState().auth.token;
    const response = await axiosInstance.post(
        ApiRoute.Resumes,
        { resume: variables },
        { headers: { Authorization: token } }
    );
    return response.data;
}