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
    qualifications: true,
    matchingAnalysis: true,
    additionalInfo: true,
  });
  const toggleSectionVisibility = (key: SectionKey) => {
    setVisibleSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const parsed = resumeData.parsed_data || {};
  const matching = resumeData.matching_result || {};

  const primary_skills: string[] = parsed.primary_skills ?? [];
  const secondary_skills: string[] = parsed.secondary_skills ?? [];
  const domain_expertise: string[] = parsed.domain_expertise ?? [];
  const referred_by = resumeData.referred_by;

  const matching_skills: string[] = [
    ...(matching.matched_skills?.must_have ?? []),
    ...(matching.matched_skills?.good_to_have ?? []),
  ];

  const missing_skills: string[] = [
    ...(matching.missing_skills?.must_have ?? []),
    ...(matching.missing_skills?.good_to_have ?? []),
  ];

  // Segregated arrays for clearer UI grouping
  const matched_must_have: string[] = matching.matched_skills?.must_have ?? [];
  const matched_good_to_have: string[] = matching.matched_skills?.good_to_have ?? [];
  const missing_must_have: string[] = matching.missing_skills?.must_have ?? [];
  const missing_good_to_have: string[] = matching.missing_skills?.good_to_have ?? [];

  const hasAdditionalInfo = typeof referred_by === "string" && referred_by.trim().length > 0;

  const sections: { key: SectionKey; title: string; content: React.ReactNode }[] = [
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
      key: "qualifications" as SectionKey,
      title: "Qualifications",
      content: (
        <div className="p-4">
          <h3 className="text-md font-semibold flex items-center mb-3 text-indigo-700">
            <Award className="mr-2 h-4 w-4" />
            Qualifications
          </h3>
          {Array.isArray(parsed.qualifications) && parsed.qualifications.length > 0 ? (
            <ul className="space-y-3">
              {parsed.qualifications.map((q, idx) => (
                <li key={idx} className="border rounded p-3 bg-gray-50">
                  <div className="font-medium text-gray-800">{q?.name || "Unnamed Qualification"}</div>
                  <div className="text-sm text-gray-600">
                    {(q?.type ? `${q.type}` : "")} {q?.year ? `• ${q.year}` : ""} {q?.issuer ? `• ${q.issuer}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No qualifications found.</div>
          )}
        </div>
      ),
    },
    {
      key: "matchingAnalysis" as SectionKey,
      title: "Matching Analysis",
      content: (
        <div className="p-4 space-y-6">
          {/* Score and Flags */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              {(() => {
                const rawScore = (matching?.match_score ?? resumeData.matching_score) as number | string | undefined;
                const num = Number(rawScore);
                let score10 = 0;
                if (!isNaN(num)) {
                  // Do not transform the score; it is already out of 10 per requirements.
                  score10 = Math.max(0, Math.min(10, num));
                }
                const color = score10 >= 7.5 ? "text-green-700" : score10 >= 5 ? "text-yellow-700" : "text-red-700";
                const display = score10.toFixed(1);
                return (
                  <div className={`text-sm font-semibold ${color}`}>Match Score: {display} / 10</div>
                );
              })()}

              <div className="flex items-center gap-2 text-sm">
                {matching?.experience_match ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4" /> Experience match
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800">
                    <XCircle className="h-4 w-4" /> Experience mismatch
                  </span>
                )}

                {matching?.qualification_match ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4" /> Qualification match
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800">
                    <XCircle className="h-4 w-4" /> Qualification mismatch
                  </span>
                )}
              </div>
            </div>

            {Array.isArray(matching?.reasoning) && matching!.reasoning!.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Reasoning</div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {matching!.reasoning!.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Skills Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold flex items-center mb-3 text-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Matching Skills
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Must-have</div>
                  <div className="flex flex-wrap gap-2">
                    {(matched_must_have.length > 0 ? matched_must_have : []).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-green-50 text-green-800 border-green-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {matched_must_have.length === 0 && (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Good-to-have</div>
                  <div className="flex flex-wrap gap-2">
                    {(matched_good_to_have.length > 0 ? matched_good_to_have : []).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-green-50 text-green-800 border-green-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {matched_good_to_have.length === 0 && (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold flex items-center mb-3 text-red-700">
                <XCircle className="mr-2 h-4 w-4" />
                Missing Skills
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Must-have</div>
                  <div className="flex flex-wrap gap-2">
                    {(missing_must_have.length > 0 ? missing_must_have : []).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-red-50 text-red-800 border-red-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {missing_must_have.length === 0 && (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Good-to-have</div>
                  <div className="flex flex-wrap gap-2">
                    {(missing_good_to_have.length > 0 ? missing_good_to_have : []).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-red-50 text-red-800 border-red-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {missing_good_to_have.length === 0 && (
                      <span className="text-xs text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    ...(hasAdditionalInfo
      ? [
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
        ]
      : []),
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
