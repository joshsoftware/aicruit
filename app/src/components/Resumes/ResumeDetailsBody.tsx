import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Code,
  Award,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Resume } from "@/services/Resume/api";
import { SectionKey } from "@/types/resume";

interface Props {
  resumeData: Resume;
}

const ResumeDetailsBody = ({ resumeData }: Props) => {
  const [visibleSections, setVisibleSections] = useState<
    Record<SectionKey, boolean>
  >({
    skills: true,
    domainExpertise: true,
    matchingAnalysis: true,
    additionalInfo: true,
  });
  const toggleSectionVisibility = (key: SectionKey) => {
    setVisibleSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const {
    primary_skills,
    secondary_skills,
    domain_expertise,
    matching_skills,
    missing_skills,
    referred_by,
  } = resumeData;

  const sections = [
    {
      key: "skills" as SectionKey,
      title: "Skills",
      content: (
        <div className="space-y-6 p-4">
          <div>
            <h3 className="text-md font-semibold flex items-center mb-3 text-indigo-700">
              <Code className="mr-2 h-4 w-4" />
              Primary Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {primary_skills.map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    matching_skills.includes(skill) ? "default" : "outline"
                  }
                  className={
                    matching_skills.includes(skill)
                      ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                      : ""
                  }
                >
                  {matching_skills.includes(skill) && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold flex items-center mb-3 text-indigo-700">
              <Code className="mr-2 h-4 w-4" />
              Secondary Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {secondary_skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "domainExpertise" as SectionKey,
      title: "Domain Expertise",
      content: (
        <div className="p-4">
          <h3 className="text-md font-semibold flex items-center mb-3 text-indigo-700">
            <Award className="mr-2 h-4 w-4" />
            Domain Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {domain_expertise.map((domain) => (
              <Badge
                key={domain}
                variant="outline"
                className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
              >
                {domain}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "matchingAnalysis" as SectionKey,
      title: "Matching Analysis",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
          <div>
            <h3 className="text-md font-semibold flex items-center mb-3 text-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Matching Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {matching_skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-green-50 text-green-800 border-green-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold flex items-center mb-3 text-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-red-50 text-red-800 border-red-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "additionalInfo" as SectionKey,
      title: "Additional Info",
      content: (
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {referred_by && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Referred by:</span>{" "}
                  {referred_by}
                </p>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="space-y-6 mt-10 mb-10">
        {sections.map(({ key, title, content }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="border rounded-lg shadow-sm transition-all duration-300 bg-white hover:shadow-lg"
          >
            <button
              className="w-full flex justify-between items-center p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-t-lg hover:cursor-pointer"
              onClick={() => toggleSectionVisibility(key)}
            >
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              {visibleSections[key] ? (
                <ChevronUp className="text-indigo-600" size={20} />
              ) : (
                <ChevronDown className="text-indigo-600" size={20} />
              )}
            </button>

            {visibleSections[key] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default ResumeDetailsBody;
