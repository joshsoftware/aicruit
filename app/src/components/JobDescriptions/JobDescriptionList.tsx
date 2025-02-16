import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDeleteJobDescription } from "@/services/JobDescription/hooks";
import { ConfirmationModal } from "../ui/ConfirmationModal";

interface JobDescription {
  id: number;
  title: string;
  status: string;
}

interface Props {
  jobDescriptions: JobDescription[];
}

const statusColorMap: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  unpublished: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
};

export default function JobDescriptionTable({ jobDescriptions }: Props) {
  const router = useRouter();
  const { isPending, sendDeleteJobDescriptionRequest } =
    useDeleteJobDescription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);

  const handleView = (id: number) => {
    router.push(`/job-description/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setJobIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobIdToDelete !== null) {
      sendDeleteJobDescriptionRequest(jobIdToDelete);
      setIsModalOpen(false);
      setJobIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setJobIdToDelete(null);
  };

  const getStatusClasses = (status: string) => {
    return `inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
      statusColorMap[status] || ""
    }`;
  };

  return (
    <div className="border overflow-hidden mt-5">
      <table className="w-full">
        <thead className="bg-gray-primary">
          <tr>
            <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
              ID
            </th>
            <th className="px-6 py-2 text-left text-sm font-medium text-gray-dark">
              Job Title
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
          {jobDescriptions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No job descriptions found
              </td>
            </tr>
          ) : (
            jobDescriptions.map((jd: JobDescription) => (
              <tr key={jd.id} className="hover:bg-gray-50">
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  #{jd.id}
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  {jd.title}
                </td>
                <td className="px-6 py-2 text-sm text-black-tertiary">
                  <span className={getStatusClasses(jd.status)}>
                    {jd.status}
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
                      onClick={() => handleView(jd.id)}
                    />
                    <Image
                      height={23}
                      width={23}
                      className="cursor-pointer"
                      src="/trash.svg"
                      alt="delete-icon"
                      onClick={
                        !isPending ? () => handleDeleteClick(jd.id) : undefined
                      }
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this job description? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
