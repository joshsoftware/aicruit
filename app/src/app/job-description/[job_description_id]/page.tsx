"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useJobDescriptionDetailsHook } from "@/services/JobDescription/hooks";
import JobDescriptionEditForm from "@/components/JobDescriptions/JobDescriptionEditForm";
import JobDescriptionDetailsSkeleton from "@/components/JobDescriptions/JobDescriptionDetailsSkeleton";
import FetchError from "@/components/ui/FetchError";
import NavigateBack from "@/components/NavigateBack";

interface JobDescriptionDetailsContainerProps {
  params: {
    job_description_id: string;
  };
}

interface SectionVisibility {
  [key: string]: boolean;
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

  const [isEditing, setIsEditing] = useState(false);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    {}
  );

  useMemo(() => {
    if (jobDescriptionDetails?.parsed_data) {
      setSectionVisibility((prev) =>
        Object.keys(jobDescriptionDetails.parsed_data).reduce(
          (acc, key) => ({ ...acc, [key]: prev[key] ?? true }),
          {}
        )
      );
    }
  }, [jobDescriptionDetails]);

  const toggleSectionVisibility = (sectionKey: string) =>
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));

  const handleEditClick = () => setIsEditing(true);
  const handleEditCancel = () => setIsEditing(false);

  if (isFetching) return <JobDescriptionDetailsSkeleton />;

  if (isError) return <FetchError />;

  if (!jobDescriptionDetails)
    return (
      <div className="p-4 text-center text-gray-700">
        No job description found
      </div>
    );

  if (isEditing)
    return (
      <JobDescriptionEditForm
        jobDescription={jobDescriptionDetails}
        onCancel={handleEditCancel}
      />
    );

  const sectionKeys = Object.keys(jobDescriptionDetails.parsed_data).sort();

  return (
    <>
      <div className="flex justify-start w-full mt-5">
        <NavigateBack />
      </div>
      <div className="p-6 max-w-4xl mx-auto mt-10 shadow-lg rounded-lg bg-white">
        <div className="bg-indigo-400 -mx-6 -mt-6 px-6 py-8 rounded-t-lg border-b border-t-black-primary">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-black-primary   mb-3">
                {jobDescriptionDetails.title}
              </h1>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  jobDescriptionDetails.status === "published"
                    ? "bg-green-100 text-green-950"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {jobDescriptionDetails.status}
              </span>
            </div>
            <Image
              className="cursor-pointer mb-14"
              onClick={handleEditClick}
              src={"/edit-icon.svg"}
              width={30}
              height={30}
              alt="edit icon"
            />
          </div>
        </div>
        <div className="space-y-6 mt-8">
          {sectionKeys.map((key, index) => {
            const isVisible = sectionVisibility[key] ?? true;
            return (
              <div key={key} className="border border-gray-200 rounded-lg">
                <div
                  className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-200"
                  onClick={() => toggleSectionVisibility(key)}
                >
                  <h2 className="text-lg font-medium text-gray-800">
                    {formatSectionTitle(key)}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={`Toggle ${key} visibility`}
                  >
                    {isVisible ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </button>
                </div>
                {isVisible && (
                  <div className="px-4 py-4 bg-white rounded-b-lg">
                    <ul className="space-y-2 text-gray-700">
                      {Array.isArray(jobDescriptionDetails.parsed_data[key]) &&
                        jobDescriptionDetails.parsed_data[key].map(
                          (item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                              <span className="text-base text-black-primary">
                                {item}
                              </span>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default JobDescriptionDetailsContainer;
