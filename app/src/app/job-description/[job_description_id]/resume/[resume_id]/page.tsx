"use client";
import React from "react";
import { notFound } from "next/navigation";
import ResumeDetails from "@/components/Resumes/ResumeDetails";

interface CandidateResumeDetailsProp {
  params: {
    resume_id: string;
  };
}

const CandidateResume: React.FC<CandidateResumeDetailsProp> = ({
  params: { resume_id },
}) => {
  const resumeId = Number(resume_id);

  if (isNaN(resumeId)) {
    return <div>{notFound()}</div>;
  }

  return <ResumeDetails resumeId={resumeId} />;
};

export default CandidateResume;
