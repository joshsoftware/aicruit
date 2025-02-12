import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteJobDescription,
  getJobDescriptionDetails,
  getJobDescriptions,
  postJobDescription,
  PostJobDescriptionVariables,
  putJobDescription,
} from "./api";
import { useRouter } from "next/navigation";
import { handleErrorResponse, pythonAxiosInstance } from "@/utils/axios";
import { toast } from "sonner";
import { useState } from "react";
import { ApiRoute } from "@/constants/route";

export function useGetJobDescriptions() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-job-descriptions"],
    queryFn: getJobDescriptions,
  });

  return {
    jobDescriptions: data?.data || [],
    isLoading,
    isError,
  };
}

export const useJobDescriptionDetailsHook = (id: number) => {
  const { isPending, isError, data, isFetching } = useQuery({
    queryKey: ["jobdescription-detail", id],
    queryFn: () => getJobDescriptionDetails(id),
  });

  const jobDescriptionDetails = data?.data;

  return {
    isPending,
    isError,
    data: jobDescriptionDetails,
    isFetching,
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
  const { sendCreateJobDescriptionRequest } = useCreateJobDesciption();

  const sendParseJobDescriptionRequest = async (
    payload: JobDescriptionPayload
  ) => {
    try {
      setIsJobCreating(true);

      const formData = new FormData();
      formData.append("title", payload.title);

      if (payload.jd_file) {
        formData.append("jd_file", payload.jd_file);
      } else if (payload.file_url) {
        formData.append("file_url", payload.file_url);
      }

      //  Parsing data from python job-Description api
      const response = await pythonAxiosInstance.post(
        ApiRoute.ParseJobDescription,
        formData
      );

      const parsedDataRecieved = response?.data?.data;

      sendCreateJobDescriptionRequest({
        title: parsedDataRecieved.title,
        parsed_data: parsedDataRecieved.parsed_data,
      });

      toast.success("Job description successfully submitted");
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
