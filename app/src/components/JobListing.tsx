import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { EyeIcon, Trash, Search, ListFilter } from "lucide-react";

const JobListingTable = () => {
  return (
    <div className="p-6 m-4  bg-[#FAFAFA]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Job Listing</h3>
        <button className="px-4 py-2 bg-[#3F37C9] text-white rounded hover:bg-blue-600">
          New Job
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-64 py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="flex items-center px-3 py-2  text-black rounded ">
          <ListFilter className="w-5 h-5" />
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">#1234</TableCell>
            <TableCell>12 Dec 2024</TableCell>
            <TableCell>Data Analyst</TableCell>
            <TableCell className="text-right flex justify-end gap-4">
              <button>
                <EyeIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
              </button>
              <button>
                <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default JobListingTable;
