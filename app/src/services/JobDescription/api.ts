import { ApiRoute } from "@/constants/route";
import { token } from "@/utils/authData";
import axiosInstance from "@/utils/axios";

export interface ParsedData {
  [key: string]:
    | string
    | string[]
    | boolean
    | number
    | Record<string, any>
    | undefined;
}

export interface JobDescription {
  id: number;
  title: string;
  parsed_data: ParsedData;
  status: string;
}

export interface GetJobDescriptionsResponse {
  success: boolean;
  data: JobDescription[];
  message: string;
}

export async function getJobDescriptions(): Promise<GetJobDescriptionsResponse> {
  const response = await axiosInstance.get<GetJobDescriptionsResponse>(
    ApiRoute.JobDescriptions,
    {
      headers: { Authorization: token },
    }
  );

  return response.data;
}

export interface GetJobDescriptionDetailsResponse {
  success: boolean;
  data: JobDescription;
  message: string;
}

export async function getJobDescriptionDetails(
  id: number
): Promise<GetJobDescriptionDetailsResponse> {
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
  job_description: JobDescription;
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
  const response = await axiosInstance.delete<DeleteJobDescriptionResponseData>(
    ApiRoute.JobDescriptions + `/${id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
}
