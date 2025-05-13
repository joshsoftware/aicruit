"use client";
import ResumeTable from "@/components/Resumes/ResumeTable";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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
          {/* Serach Icon */}
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
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
          {/* down arrow icoon for sort */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDownIcon className="h-4 w-4" />
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
