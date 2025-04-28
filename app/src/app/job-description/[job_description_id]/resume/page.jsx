"use client";

import ResumeTable from "@/components/Resumes/ResumeTable";
import { useParams } from "next/navigation";
import React from "react";

const Resumes = () => {
  const { jobId } = useParams();
  const params = {
    job_description_id: jobId,
  };
  return (
    <div>
      <ResumeTable params={params} />
    </div>
  );
};

export default Resumes;
