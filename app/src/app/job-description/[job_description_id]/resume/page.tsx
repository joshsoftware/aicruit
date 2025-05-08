"use client";
import ResumeTable from "@/components/Resumes/ResumeTable";
import React, { useState } from "react";

interface ResumeDetailsContainerProp {
  params: {
    job_description_id: string;
  };
}

const Resumes: React.FC<ResumeDetailsContainerProp> = ({
  params: { job_description_id },
}) => {
  const jobId = Number(job_description_id);
  const [searchKey, setSearchKey] = useState("");
  const [sortKey, setSortKey] = useState("");
  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="border p-2 pl-10 rounded-md"
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="relative ml-5 w-55">
          <select
            name="sort"
            id="resume-sort"
            className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-black focus:border-black appearance-none"
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="firstname_asc">First Name (A–Z)</option>
            <option value="firstname_desc">First Name (Z–A)</option>
            <option value="lastname_asc">Last Name (A–Z)</option>
            <option value="last_name_desc">Last Name (Z–A)</option>
            <option value="email_asc">Email (A–Z)</option>
            <option value="email_desc">Email (Z–A)</option>
            <option value="experience_asc">Experience (Low to High)</option>
            <option value="experience_desc">Experience (High to Low)</option>
            <option value="status_asc">Status (A–Z)</option>
            <option value="status_desc">Status (Z–A)</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 01-.7-.29l-3-3a1 1 0 111.4-1.42L10 9.58l2.3-2.3a1 1 0 111.4 1.42l-3 3A1 1 0 0110 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <ResumeTable
        job_description_id={jobId}
        searchKey={searchKey}
        sortKey={sortKey}
      />
    </div>
  );
};

export default Resumes;
