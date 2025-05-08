import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatResumeStatus } from "@/utils/helpers";
import { Briefcase, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Resume } from "@/services/Resume/api";

interface Props {
  resumeData: Resume;
}
const ResumeDetailsHeader = ({ resumeData }: Props) => {
  const {
    candidate_first_name,
    candidate_last_name,
    candidate_email,
    years_of_experience,
    link_to_file,
    status,
  } = resumeData;
  const fullName = `${candidate_first_name} ${candidate_last_name}`;
  const initials = `${candidate_first_name.charAt(0)}${candidate_last_name.charAt(0)}`;

  return (
    <div className="mt-10">
      <Card className="w-full shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                aria-label={`Avatar of ${fullName}`}
                className="h-16 w-16 border-2 border-indigo-200"
              >
                <AvatarFallback className="text-lg font-bold bg-indigo-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  {fullName}
                </CardTitle>
                <p className="text-gray-600 flex items-center mt-1">
                  <User className="h-4 w-4 mr-1" />
                  {candidate_email}
                </p>
                <div className="flex items-center mt-1">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-gray-600">
                    {years_of_experience} years of experience
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm capitalize bg-indigo-100 text-indigo-800 border-indigo-200"
              >
                {formatResumeStatus(status)}
              </Badge>
              <a href={link_to_file} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </Button>
              </a>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResumeDetailsHeader;
