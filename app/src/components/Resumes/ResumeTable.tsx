"use client";
import { GetResumesListParams, Resume } from "@/services/Resume/api";
import { useGetResumesList } from "@/services/Resume/hooks";
import { formatResumeStatus } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ResumeTable = ({
  job_description_id,
  searchKey,
  sortKey,
}: GetResumesListParams) => {
  const { data, isLoading, isError } = useGetResumesList({
    job_description_id,
    searchKey,
    sortKey,
  });

  const router = useRouter();

  const handleViewResume = (id: number) => {
    router.push(`resume/${id}`);
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800";
      case "rejected":
        return "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800";
      case "hired":
        return "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800";
      default:
        return "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div>Loading.......</div>;
  }

  if (isError) {
    return <div>Something went wrong while loading resumes.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 mt-5 border">
        <thead className="bg-gray-primary">
          <tr>
            <th
              scope="col"
              className="px-6 py-2 text-left text-sm font-medium text-gray-dark"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-sm font-medium text-gray-dark"
            >
              Candidate Name
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-sm font-medium text-gray-dark"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-sm font-medium text-gray-dark"
            >
              Experience
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-sm font-medium text-gray-dark"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-right text-sm font-medium text-gray-dark"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No resumes found
              </td>
            </tr>
          ) : (
            data?.data.map((resume) => (
              <tr key={resume.id} className="hover:bg-gray-50">
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  #{resume.id}
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  {resume.candidate_first_name} {resume.candidate_last_name}
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  {resume.candidate_email}
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  {resume.years_of_experience} yrs
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  <span className={getStatusClasses(resume.status)}>
                    {formatResumeStatus(resume.status)}
                  </span>
                </td>
                <td className="px-6 py-2 text-right text-sm">
                  <div className="flex justify-end space-x-4">
                    <Image
                      height={23}
                      width={23}
                      className="cursor-pointer"
                      src="/view-icon.svg"
                      alt="view-icon"
                      onClick={() => handleViewResume(resume.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeTable;
