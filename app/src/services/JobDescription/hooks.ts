import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getJobDescriptionDetails,
  getJobDescriptions,
  postJobDescription,
  PostJobDescriptionVariables,
  putJobDescription,
} from "./api";
import { useRouter } from "next/navigation";
import { handleErrorResponse } from "@/utils/axios";
import { toast } from "sonner";
import { useState } from "react";

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
  const router = useRouter();
  const queryClient = useQueryClient(); // Add this

  const { isPending, mutate: modifyMutate } = useMutation({
    mutationKey: ["edit-jobdescription", JobId],
    mutationFn: putJobDescription,
    onSuccess: (data) => {
      // Log success response
      console.log("Mutation success:", data);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["jobDescription", JobId] });

      toast.success("Job description edited successfully");
      router.push(`/job-description/${JobId}`);
    },
    onError: (error) => {
      console.error("Mutation error details:", error);
      handleErrorResponse(error);
    },
  });

  return { isPending, modifyMutate };
};

export const useJobDesciption = () => {
  const router = useRouter();

  const [disableSubmit, setDisableSubmit] = useState(false);
  const { mutate, isPending: isJobCreating } = useMutation({
    mutationKey: ["job-description"],
    mutationFn: postJobDescription,
    onSuccess: async (res) => {
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
