import { ApiRoute } from "@/constants/route";
import store from "@/redux/store";
import axiosInstance from "@/utils/axios";

export interface ParsedData {
  [key: string]: string | number | boolean | string[] | ParsedData;
}

export interface JobDescription {
  id: number;
  title: string;
  parsed_data: ParsedData;
  status: string;
  published_at?: string;
  total_applicants?: number;
}
export interface publishedJobDescription {
  id: string;
  title: string;
  parsed_data: ParsedData;
  status: string;
  published_at: string;
}

export interface GetJobDescriptionsResponse {
  success: boolean;
  data: JobDescription[];
  message: string;
}
export interface GetPublishedJobDescriptionsResponse {
  success: boolean;
  data: publishedJobDescription[];
  message: string;
}

export async function getJobDescriptions(): Promise<GetJobDescriptionsResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get(
    ApiRoute.JobDescriptions,
    {
      headers: { Authorization: token },
    }
  );

  return response.data as GetJobDescriptionsResponse;
}

export async function getPublishedJobDescriptions(): Promise<GetPublishedJobDescriptionsResponse> {
  const response = await axiosInstance.get(
    ApiRoute.PublishedJobDescriptions
  );
  return response.data as GetPublishedJobDescriptionsResponse;
}

export interface GetJobDescriptionDetailsResponse {
  success: boolean;
  data: JobDescription;
  message: string;
}

export async function getJobDescriptionDetails(
  id: number
): Promise<GetJobDescriptionDetailsResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get<GetJobDescriptionDetailsResponse>(
    ApiRoute.JobDescriptions + `/${id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return {
    success: response.data.success,
    data: response.data.data,
    message: response.data.message,
  };
}

export interface EditJobDescriptionFormData {
  job_description: Partial<JobDescription>;
}

export interface PutJobDescriptionVariables {
  jobId: number;
  body: EditJobDescriptionFormData;
}

export interface PutJobDescriptionResponseData {
  success: boolean;
  data: EditJobDescriptionFormData;
  message: string;
}

export async function putJobDescription(payload: PutJobDescriptionVariables) {
  const state = store.getState();
  const token = state.auth.token;
  try {
    const { jobId, body } = payload;
    const response = await axiosInstance.put<PutJobDescriptionResponseData>(
      ApiRoute.JobDescriptions + `/${jobId}`,
      body,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("PUT Request Error:", error);
    throw error;
  }
}

export interface PostJobDescriptionVariables {
  title: string;
  parsed_data: ParsedData;
}

export interface PostJobDescriptionResponseData {
  success: true;
  data: {
    job_description: {
      title: string;
      parsed_data: ParsedData;
    };
  };
  message: string;
}

export async function postJobDescription(
  variables: PostJobDescriptionVariables
) {
  const state = store.getState();
  const token = state.auth.token;
  const { title, parsed_data } = variables;

  const response = await axiosInstance.post<PostJobDescriptionResponseData>(
    ApiRoute.JobDescriptions,
    {
      job_description: {
        title,
        parsed_data,
      },
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
}

export interface DeleteJobDescriptionResponseData {
  success: boolean;
  message: string;
}

export async function deleteJobDescription(
  id: number
): Promise<DeleteJobDescriptionResponseData> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.delete(
    ApiRoute.JobDescriptions + `/${id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data as DeleteJobDescriptionResponseData;
}

export interface GetApplicantResumesResponse {
  success: boolean;
  data: any;
  message: string;
}

export async function getApplicantResumes(
  id: number
): Promise<GetApplicantResumesResponse> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axiosInstance.get(
    `${ApiRoute.JobDescriptions}/${id}${ApiRoute.ApplicantResumesSuffix}`,
    {
      headers: { Authorization: token },
    }
  );
  return response.data as GetApplicantResumesResponse;
}
