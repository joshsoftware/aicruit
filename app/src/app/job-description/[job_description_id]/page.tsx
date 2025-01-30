"use client";
import { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import JobDescriptionSkeleton from "@/components/JobDescriptions/JobDescriptionSkeleton";
import { useJobDescriptionDetailsHook } from "@/services/JobDescription/hooks";
import JobDescriptionEditForm from "@/components/JobDescriptions/JobDescriptionEditForm";

interface JobDescriptionDetailsContainerProps {
  params: {
    job_description_id: string;
  };
}

interface SectionVisibility {
  [key: string]: boolean;
}

// Array of tailwind color classes for section titles
const colorClasses = [
  "text-purple-600",
  "text-green-600",
  "text-teal-600",
  "text-orange-600",
  "text-blue-600",
  "text-red-600",
  "text-indigo-600",
  "text-pink-600",
  "text-cyan-600",
  "text-emerald-600",
  "text-rose-600",
  "text-sky-600",
  "text-violet-600",
  "text-amber-600",
  "text-lime-600",
];

// Helper function to get color based on index
const getColorClass = (index: number): string => {
  return colorClasses[index % colorClasses.length];
};

// Helper function to format section title
const formatSectionTitle = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const JobDescriptionDetailsContainer: React.FC<
  JobDescriptionDetailsContainerProps
> = ({ params: { job_description_id } }) => {
  const jobId = Number(job_description_id);
  const { data: jobDescriptionDetails, isFetching } =
    useJobDescriptionDetailsHook(jobId);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate initial visibility state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    () => {
      if (!jobDescriptionDetails?.parsed_data) return {};

      return Object.keys(jobDescriptionDetails.parsed_data).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      );
    }
  );

  // Update visibility state when new data is received
  useMemo(() => {
    if (jobDescriptionDetails?.parsed_data) {
      setSectionVisibility((prev) => {
        const newState = { ...prev };
        Object.keys(jobDescriptionDetails.parsed_data).forEach((key) => {
          if (!(key in newState)) {
            newState[key] = true;
          }
        });
        return newState;
      });
    }
  }, [jobDescriptionDetails]);

  const toggleSectionVisibility = (sectionKey: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleEditCancel = () => setIsEditing(false);
  const handleDeleteClick = () => setIsModalOpen(true);

  if (isFetching) {
    return <JobDescriptionSkeleton />;
  }

  if (!jobDescriptionDetails) {
    return (
      <div className="p-4 text-center">
        <p className="text-black-primary">No job description found</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <JobDescriptionEditForm
        jobDescription={jobDescriptionDetails}
        onCancel={handleEditCancel}
      />
    );
  }

  // Get sorted section keys to ensure consistent color assignment
  const sectionKeys = Object.keys(jobDescriptionDetails.parsed_data).sort();

  const renderSection = (sectionKey: string, data: any, index: number) => {
    if (!Array.isArray(data)) return null;

    const isVisible = sectionVisibility[sectionKey] ?? true;
    const colorClass = getColorClass(index);
    const title = formatSectionTitle(sectionKey);

    return (
      <div key={sectionKey} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-medium ${colorClass} mt-4`}>{title}</h2>
          <button
            onClick={() => toggleSectionVisibility(sectionKey)}
            className="text-gray-600"
            aria-label={`Toggle ${title.toLowerCase()} visibility`}
          >
            {isVisible ? (
              <FaChevronUp size={16} />
            ) : (
              <FaChevronDown size={16} />
            )}
          </button>
        </div>
        {isVisible && (
          <ul className="list-disc pl-6 text-black-primary">
            {data.map((item: string, index: number) => (
              <li key={index} className="text-base">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mt-10 mx-auto shadow-lg rounded-lg border-t-4 border-gray-500">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-indigo-700">
            {jobDescriptionDetails.title}
          </h1>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                jobDescriptionDetails.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {jobDescriptionDetails.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleEditClick}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Edit job description"
          >
            <FaEdit size={20} />
          </button>
          {/* <button
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Delete job description"
          >
            <FaTrash size={20} />
          </button> */}
        </div>
      </div>

      <div className="space-y-6">
        {sectionKeys.map((key, index) =>
          renderSection(key, jobDescriptionDetails.parsed_data[key], index)
        )}
      </div>
    </div>
  );
};

export default JobDescriptionDetailsContainer;
