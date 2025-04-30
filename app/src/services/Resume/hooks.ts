import { useQuery } from "@tanstack/react-query";
import { getResumesList, GetResumesListParams } from "./api";

export function useGetResumesList({job_description_id}: GetResumesListParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-resumes"],
    queryFn: () => getResumesList({job_description_id}),
  });

  return {
    data,
    isLoading,
    isError,
  };
}
