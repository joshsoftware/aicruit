"use client";

import NavigateBack from "@/components/NavigateBack";
import JobDescriptionForm from "@/components/JobDescriptionForm";

export default function Page() {
  return (
    <div className="flex flex-col w-full bg-gray-50 ">
      <div className="mt-3">
        <NavigateBack />
      </div>
      <JobDescriptionForm />
    </div>
  );
}
