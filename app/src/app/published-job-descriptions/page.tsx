"use client";
import { Button } from "@/components/ui/button";
import { useGetJobDescriptions } from "@/services/JobDescription/hooks";
import { formatDate } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const OpenJobDescriptions = () => {
  const { isLoading, isError, publishedJobDescriptions } =
    useGetJobDescriptions();
  const router = useRouter();

  if (isLoading) return <p>Loading.............</p>;

  if (isError)
    return (
      <p className="text-red-500 text-center">
        Error loading job descriptions.
      </p>
    );

  const handleApplyNow = (jobId: string) => {
    router.push(`/job-description/${jobId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Current openings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
        {publishedJobDescriptions.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-br-lg">
              {job.status}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 mt-3">
              {job.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Published on: {formatDate(job.published_at)}
            </p>
            <Button
              onClick={() => handleApplyNow(job.id)}
              className="w-full py-2 mt-10 text-white font-medium rounded-md bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
            >
              Apply Now
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OpenJobDescriptions;
