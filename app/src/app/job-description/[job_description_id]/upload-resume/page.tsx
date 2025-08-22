import React from "react";
import NavigateBack from "@/components/NavigateBack";
import ResumeForm from "@/components/Resume/ResumeForm";

export default function Page({ params }: { params: { job_description_id: string } }) {
  const jobId = Number(params.job_description_id);

  return (
    <div className="flex flex-col w-full pt-2">
      <div className="flex justify-start w-full mb-4">
        <NavigateBack />
      </div>
      <ResumeForm jobId={jobId} />
    </div>
  );
}
