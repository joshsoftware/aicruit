"use client";
import React, { useState, useEffect } from "react";
import { useJobDescriptionDetailsHook, useModifyJobDescription } from "@/services/JobDescription/hooks";
import JobDescriptionEditForm from "@/components/JobDescriptions/JobDescriptionEditForm";
import JobDescriptionDetailsSkeleton from "@/components/JobDescriptions/JobDescriptionDetailsSkeleton";
import FetchError from "@/components/ui/FetchError";
import NavigateBack from "@/components/NavigateBack";
import useAuthUser from "@/hooks/useAuthUser";
import { UserRoles } from "@/constants/constants";
import JobDescriptionHeader from "@/components/JobDescriptions/JobDescriptionHeader";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionVisibilityState {
  [key: string]: boolean;
}

interface JobDescriptionDetailsContainerProps {
  params: {
    job_description_id: string;
  };
}

const formatSectionTitle = (key: string): string =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const JobDescriptionDetailsContainer: React.FC<
  JobDescriptionDetailsContainerProps
> = ({ params: { job_description_id } }) => {
  const jobId = Number(job_description_id);
  const {
    data: jobDescriptionDetails,
    isFetching,
    isError,
    refetch,
  } = useJobDescriptionDetailsHook(jobId);
  const authUser = useAuthUser();
  const isCandidate = authUser?.roleName === UserRoles.CANDIDATE;

  const [isEditing, setIsEditing] = useState(false);
  const [sectionVisibility, setSectionVisibility] =
    useState<SectionVisibilityState>({});
  const { isPending: isUpdatingStatus, modifyMutate } = useModifyJobDescription(jobId);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const allStatuses = ["draft", "unpublished", "published", "closed"] as const;
  const availableStatuses = allStatuses.filter(
    (s) => s !== (jobDescriptionDetails?.status as typeof allStatuses[number])
  );

  const handleStatusChange = (nextStatus: string) => {
    if (!nextStatus || isUpdatingStatus) return;
    modifyMutate({
      jobId,
      body: { job_description: { status: nextStatus } },
    });
    setStatusMenuOpen(false);
  };

  useEffect(() => {
    if (jobDescriptionDetails?.parsed_data) {
      setSectionVisibility(
        Object.keys(jobDescriptionDetails.parsed_data).reduce<SectionVisibilityState>(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
    }
  }, [jobDescriptionDetails?.parsed_data]);

  useEffect(() => {
    const handlePageShow = (e: any) => {
      if (e && (e as any).persisted) {
        refetch();
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("pageshow", handlePageShow);
      document.addEventListener("visibilitychange", handleVisibility);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("pageshow", handlePageShow);
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, [refetch]);

  const toggleSectionVisibility = (sectionKey: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  if (isFetching) return <JobDescriptionDetailsSkeleton />;
  if (isError) return <FetchError />;
  if (!jobDescriptionDetails) {
    return (
      <div className="p-6 text-center text-gray-700 font-medium">
        No job description found
      </div>
    );
  }

  if (isEditing) {
    return (
      <JobDescriptionEditForm
        jobDescription={jobDescriptionDetails}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const sectionKeys = Object.keys(jobDescriptionDetails.parsed_data).sort();

  return (
    <>
      <div className="mt-4 px-6">
        <NavigateBack />
      </div>
      <div className="p-6 max-w-7xl mx-auto mt-10 space-y-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <JobDescriptionHeader
            title={jobDescriptionDetails.title}
            publishedAt={jobDescriptionDetails.published_at || ""}
            status={jobDescriptionDetails.status}
            onEdit={() => setIsEditing(true)}
            isCandidate={isCandidate}
          />
          <div className="p-6 space-y-4">
            {!isCandidate && (
              <div className="flex justify-end mb-4">
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setStatusMenuOpen((prev) => !prev)}
                    disabled={isUpdatingStatus}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isUpdatingStatus ? "Updating..." : "Change status"}
                  </button>
                  {statusMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {availableStatuses.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(s)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {sectionKeys.map((key) => {
              const isVisible = sectionVisibility[key];
              const sectionData = jobDescriptionDetails.parsed_data[key];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="border rounded-lg shadow-sm transition-all duration-300 bg-white hover:shadow-lg"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-t-lg hover:cursor-pointer"
                    onClick={() => toggleSectionVisibility(key)}
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      {formatSectionTitle(key)}
                    </h2>
                    {isVisible ? (
                      <ChevronUp className="text-indigo-600" size={20} />
                    ) : (
                      <ChevronDown className="text-indigo-600" size={20} />
                    )}
                  </button>
                  {isVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="border-t p-4 bg-gray-50"
                    >
                      <ul className="space-y-3">
                        {Array.isArray(sectionData) &&
                          sectionData.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 group hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            >
                              <span className="h-2 w-2 rounded-full bg-indigo-500 mt-2 group-hover:bg-indigo-600 transition-colors" />
                              <span className="text-base text-gray-900">
                                {item}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
            {isCandidate && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-center">
                  <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 transform hover:scale-105">
                    Upload your resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescriptionDetailsContainer;
