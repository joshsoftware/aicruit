import React, { useEffect, useState } from "react";
import ResumeDetailsHeader from "./ResumeDetailsHeader";
import ResumeDetailsBody from "./ResumeDetailsBody";
import { Resume } from "@/services/Resume/api";
import { useGetResumeById } from "@/services/Resume/hooks";

interface Props {
  resumeId: number;
}
export const ResumeDetails = ({ resumeId }: Props) => {
  const { data, isLoading, isError } = useGetResumeById(resumeId);
  const [resumeData, setResumeData] = useState<Resume>();

  useEffect(() => {
    setResumeData(data);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !resumeData) return <div>Error loading resume data.</div>;

  return (
    <div>
      <ResumeDetailsHeader resumeData={resumeData} />
      <ResumeDetailsBody resumeData={resumeData} />
    </div>
  );
};

export default ResumeDetails;
