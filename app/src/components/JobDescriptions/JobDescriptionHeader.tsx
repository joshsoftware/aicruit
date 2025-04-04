import { motion } from "framer-motion";
import { Calendar, Edit } from "lucide-react";
import { formatDate } from "@/utils/helpers";

interface JobDescriptionHeaderProps {
  title: string;
  publishedAt: string;
  status: string;
  onEdit: () => void;
  isCandidate: boolean;
}

const JobDescriptionHeader: React.FC<JobDescriptionHeaderProps> = ({
  title,
  publishedAt,
  status,
  onEdit,
  isCandidate,
}) => (
  <div className="border-b p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      {!isCandidate && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onEdit}
          className="flex items-center gap-2 bg-white text-indigo-600 font-medium px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all"
        >
          <Edit size={16} /> Edit
        </motion.button>
      )}
    </div>
    <div className="flex items-center gap-2 mt-3 text-lg">
      <Calendar size={16} />
      <p>Opens from: {formatDate(publishedAt)}</p>
    </div>
    <span
      className={`inline-block px-3 py-1 mt-4 text-sm font-semibold rounded-full shadow-md ${
        status === "published"
          ? "bg-green-500 text-white"
          : "bg-yellow-500 text-black"
      }`}
    >
      {status}
    </span>
  </div>
);

export default JobDescriptionHeader;
