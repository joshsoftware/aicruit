"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetJobDescriptions } from "@/services/JobDescription/hooks";
import JobDescriptionTable from "@/components/JobDescriptions/JobDescriptionList";
import JobDescriptionTableSkeleton from "@/components/JobDescriptions/JobDescriptionListSkeleton";
import FetchError from "@/components/ui/FetchError";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { jobDescriptions, isLoading, isError } = useGetJobDescriptions();
  const router = useRouter();

  if (isLoading) {
    return <JobDescriptionTableSkeleton />;
  }

  if (isError) {
    <FetchError />;
  }

  const handleNewJob = () => {
    router.push("/job-description/new");
  };

  return (
    <div className="w-full px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mt-4">Job listing</h1>
        <Button
          onClick={handleNewJob}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-700"
        >
          New Job description
        </Button>
      </div>
      <JobDescriptionTable jobDescriptions={jobDescriptions} />
    </div>
  );
}
