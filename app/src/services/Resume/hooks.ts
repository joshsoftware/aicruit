import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { getResumeById, getResumesList, GetResumesListParams, createResumeFromParsed, parseResumeFromUrl, postResumeFileUpload  } from "./api";

export interface ResumePayload {
    job_description_id: number;
    resume_file?: File;
    file_url?: string;
    candidate_email?: string;
    candidate_first_name?: string;
    candidate_last_name?: string;
}

export function useUploadResume() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendUploadResumeRequest = async (payload: ResumePayload) => {
        try {
            setIsSubmitting(true);

            if (payload.resume_file) {
                await postResumeFileUpload({
                    job_description_id: payload.job_description_id,
                    resume_file: payload.resume_file,
                    candidate_email: payload.candidate_email || "",
                    candidate_first_name: payload.candidate_first_name || "",
                    candidate_last_name: payload.candidate_last_name || "",
                });
                toast.success("Resume uploaded successfully");
                router.push(`/job-description/${payload.job_description_id}`);
                return;
            }

            if (payload.file_url) {
                const parsed = await parseResumeFromUrl({ file_url: payload.file_url });
                await createResumeFromParsed({
                    job_description_id: payload.job_description_id,
                    parsed_data: parsed?.data?.parsed_data,
                });
                toast.success("Resume submitted successfully");
                router.push(`/job-description/${payload.job_description_id}`);
                return;
            }

          throw new Error("Please provide a file or a URL");
        } catch (err: any) {
            const message = err?.message || "Failed to upload resume";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { sendUploadResumeRequest, isSubmitting, disableSubmit: isSubmitting };
}

export function useGetResumesList({
  job_description_id,
  searchKey,
  sortKey,
}: GetResumesListParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-resumes", searchKey, sortKey],
    queryFn: () => getResumesList({ job_description_id, searchKey, sortKey }),
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
