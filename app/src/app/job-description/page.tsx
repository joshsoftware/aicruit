"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetJobDescriptions } from "@/services/JobDescription/hooks";
import JobDescriptionTable from "@/components/JobDescriptions/JobDescriptionTable";
import JobDescriptionTableSkeleton from "@/components/JobDescriptions/JobDescriptionSkeleton";

export default function Page() {
  const { jobDescriptions, isLoading, isError } = useGetJobDescriptions();
  const router = useRouter();

  if (isLoading) {
    return <JobDescriptionTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">
          Error loading job descriptions
        </div>
      </div>
    );
  }

  const handleNewJob = () => {
    router.push("/job-description/new");
  };

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mt-4">Job listing</h1>
        <button
          onClick={handleNewJob}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-700"
        >
          New Job
        </button>
      </div>
      <JobDescriptionTable jobDescriptions={jobDescriptions} />
    </div>
  );
}
