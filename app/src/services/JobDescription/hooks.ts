import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteJobDescription,
  getJobDescriptionDetails,
  getJobDescriptions,
  getPublishedJobDescriptions,
  postJobDescription,
  PostJobDescriptionVariables,
  putJobDescription,
} from "./api";
import { useRouter } from "next/navigation";
import axiosInstance, { handleErrorResponse, pythonAxiosInstance } from "@/utils/axios";
import { toast } from "sonner";
import { useState } from "react";
import { ApiRoute } from "@/constants/route";
import store from "@/redux/store";

export function useGetJobDescriptions() {
  const token = store.getState().auth.token;
  const {
    data: jobDescriptionsData,
    isLoading: isLoadingJobDescriptions,
    isError: isErrorJobDescriptions,
  } = useQuery({
    queryKey: ["get-job-descriptions", token],
    queryFn: getJobDescriptions,
    enabled: !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const {
    data: publishedJobDescriptionsData,
    isLoading: isLoadingPublishedJobDescriptions,
    isError: isErrorPublishedJobDescriptions,
  } = useQuery({
    queryKey: ["get-published-jobdescriptions"],
    queryFn: getPublishedJobDescriptions,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const jobDescriptions = jobDescriptionsData?.data || [];
  const publishedJobDescriptions = publishedJobDescriptionsData?.data || [];

  const isLoading =
    isLoadingJobDescriptions || isLoadingPublishedJobDescriptions;
  const isError = isErrorJobDescriptions || isErrorPublishedJobDescriptions;

  return {
    jobDescriptions,
    publishedJobDescriptions,
    isLoading,
    isError,
  };
}

export const useJobDescriptionDetailsHook = (id: number) => {
  const token = store.getState().auth.token;
  const { isPending, isError, data, isFetching, refetch } = useQuery({
    queryKey: ["jobdescription-detail", id, token],
    queryFn: () => getJobDescriptionDetails(id),
    enabled: !!id && !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const jobDescriptionDetails = data?.data;

  return {
    isPending,
    isError,
    data: jobDescriptionDetails,
    isFetching,
    refetch,
  };
};

export const useModifyJobDescription = (JobId: number) => {
  const queryClient = useQueryClient();

  const { isPending, mutate: modifyMutate } = useMutation({
    mutationKey: ["edit-jobdescription", JobId],
    mutationFn: putJobDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobdescription-detail"],
      });
      toast.success("Job description edited successfully");
    },
    onError: (error) => {
      handleErrorResponse(error);
    },
  });

  return { isPending, modifyMutate };
};

export const useCreateJobDesciption = () => {
  const router = useRouter();

  const [disableSubmit, setDisableSubmit] = useState(false);
  const { mutate, isPending: isJobCreating } = useMutation({
    mutationKey: ["job-description"],
    mutationFn: postJobDescription,
    onSuccess: async () => {
      toast.success("Job description added successfully");
      router.push("/job-description");
    },
    onError: (error) => handleErrorResponse(error),
    onSettled: () => {
      setDisableSubmit(false);
    },
  });

  const sendCreateJobDescriptionRequest = (
    variables: PostJobDescriptionVariables
  ) => {
    setDisableSubmit(true);
    mutate(variables);
  };

  return {
    sendCreateJobDescriptionRequest,
    isJobCreating,
    disableSubmit,
  };
};

export const useDeleteJobDescription = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteMutate } = useMutation({
    mutationKey: ["delete-job-description"],
    mutationFn: deleteJobDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-job-descriptions"],
      });
      toast.success("Job description deleted successfully");
    },
    onError: (error) => handleErrorResponse(error),
  });

  const sendDeleteJobDescriptionRequest = (id: number) => {
    deleteMutate(id);
  };

  return {
    isPending,
    sendDeleteJobDescriptionRequest,
  };
};

interface JobDescriptionPayload {
  title: string;
  jd_file?: File;
  file_url?: string;
}

interface JobDescriptionPayload {
  title: string;
  jd_file?: File;
  file_url?: string;
}

export function useParseJobDescription() {
  const [isJobCreating, setIsJobCreating] = useState(false);
  const router = useRouter();

  const sendParseJobDescriptionRequest = async (
    payload: JobDescriptionPayload
  ) => {
    try {
      setIsJobCreating(true);

      // If a file is provided, directly call the second API with multipart/form-data
      if (payload.jd_file) {
        const formData = new FormData();
        formData.append("job_description[title]", payload.title);
        formData.append("pdf_file", payload.jd_file);

        const state = store.getState();
        const token = state.auth.token;

        await axiosInstance.post(ApiRoute.JobDescriptionsUpload, formData, {
          headers: {
            Authorization: token,
            // Let the browser set the correct multipart boundary
          },
        });

        toast.success("Job description added successfully");
        router.push("/job-description");
        return;
      }

      // Fallback for URL-based uploads: keep existing two-step behavior
      if (payload.file_url) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("file_url", payload.file_url);

        //  Parsing data from python job-Description api
        const response = await pythonAxiosInstance.post(
          ApiRoute.ParseJobDescription,
          formData
        );

        const parsedDataRecieved = response?.data?.data;

        // Post the parsed data to create the job description
        const state = store.getState();
        const token = state.auth.token;
        await axiosInstance.post(
          ApiRoute.JobDescriptions,
          {
            job_description: {
              title: parsedDataRecieved.title,
              parsed_data: parsedDataRecieved.parsed_data,
            },
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        toast.success("Job description successfully submitted");
        router.push("/job-description");
        return;
      }

      // If neither file nor URL provided, throw an error
      throw new Error("Please provide a file or a URL");
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsJobCreating(false);
    }
  };

  return {
    sendParseJobDescriptionRequest,
    isJobCreating,
    disableSubmit: isJobCreating,
  };
}
