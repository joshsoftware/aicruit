import { ApiRoute } from "@/constants/route";
import store from "@/redux/store";
import axiosInstance from "@/utils/axios";

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
  status: string;
}

export interface GetResumesListResponse {
  success: boolean;
  data: Resume[];
  message: string;
}

export interface GetResumesListParams {
  job_description_id?: number;
  status?: string;
}

export async function GetResumesList(
  params: GetResumesListParams
): Promise<GetResumesListResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get<GetResumesListResponse>(
    ApiRoute.Resumes,
    {
      params: {
        job_description_id: params.job_description_id
      },
      headers: { Authorization: token },
    }
  );

  return response.data;
}
