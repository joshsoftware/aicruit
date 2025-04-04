"use client";
import React, { useState, useMemo } from "react";
import { useJobDescriptionDetailsHook } from "@/services/JobDescription/hooks";
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
  } = useJobDescriptionDetailsHook(jobId);
  const authUser = useAuthUser();
  const isCandidate = authUser?.roleName === UserRoles.CANDIDATE;

  const [isEditing, setIsEditing] = useState(false);
  const [sectionVisibility, setSectionVisibility] =
    useState<SectionVisibilityState>({});

  useMemo(() => {
    if (jobDescriptionDetails?.parsed_data) {
      setSectionVisibility(
        Object.keys(
          jobDescriptionDetails.parsed_data
        ).reduce<SectionVisibilityState>(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
    }
  }, [jobDescriptionDetails]);

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
