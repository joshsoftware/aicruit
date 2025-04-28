import { useQuery } from "@tanstack/react-query";
import { GetResumesList, GetResumesListParams } from "./api";

export function useGetResumesList(params: GetResumesListParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-resumes"],
    queryFn: () => GetResumesList(params),
  });

  return {
    data,
    isLoading,
    isError,
  };
}
