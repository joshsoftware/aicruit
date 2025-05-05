import { useQuery } from "@tanstack/react-query";
import { getResumeById, getResumesList, GetResumesListParams } from "./api";

export function useGetResumesList({job_description_id}: GetResumesListParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-resumes"],
    queryFn: () => getResumesList({ job_description_id }),
  });

  return {
    data,
    isLoading,
    isError,
  };
}

export function useGetResumeById(id: number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-resume-by-id", id],
    queryFn: () => getResumeById(id),
  });

  const resumeDetails = data?.data;

  return {
    data: resumeDetails,
    isLoading,
    isError,
  };
}
