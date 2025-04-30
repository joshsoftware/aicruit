import ResumeTable from "@/components/Resumes/ResumeTable";
import React from "react";

interface ResumeDetailsContainerProp {
  params: {
    job_description_id: string;
  };
}

const Resumes: React.FC<ResumeDetailsContainerProp> = ({
  params: { job_description_id },
}) => {
  const jobId = Number(job_description_id);

  return (
    <div>
      <ResumeTable job_description_id={jobId} />
    </div>
  );
};

export default Resumes;
