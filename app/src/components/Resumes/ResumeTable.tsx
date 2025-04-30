"use client";
import { GetResumesListParams, Resume } from "@/services/Resume/api";
import { useGetResumesList } from "@/services/Resume/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ResumeTable = ({job_description_id}: GetResumesListParams) => {
  const { data, isLoading, isError } = useGetResumesList({job_description_id});

  const router = useRouter();

  const handleViewResume = (id: number) => {
    router.push(`resume/${id}`);
  };

  if (isLoading) {
    return <div>Loading.......</div>;
  }

  if (isError) {
    return <div>Something went wrong while loading resumes.</div>;
  }

  return (
    <table className="w-full mt-10">
      <thead className="bg-gray-primary">
        <tr>
          <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
            ID
          </th>
          <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
            Candidate Name
          </th>
          <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
            Email
          </th>
          <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
            Experience
          </th>
          <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
            Status
          </th>
          <th className="px-6 py-2 text-right text-sm font-medium text-gray-dark">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data?.data?.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
              No resumes found.
            </td>
          </tr>
        ) : (
          data?.data.map((resume: Resume) => (
            <tr key={resume.id} className="hover:bg-gray-50">
              <td className="px-6 py-2 text-sm text-black-tertiary">
                {resume.id}
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
                {resume.status}
              </td>
              <td className="px-6 py-2 text-right text-sm">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleViewResume(resume.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ResumeTable;
