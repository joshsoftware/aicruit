"use client";

import React, { useEffect, useMemo, useState } from "react";
import NavigateBack from "@/components/NavigateBack";
import { useQuery } from "@tanstack/react-query";
import { getApplicantResumes } from "@/services/JobDescription/api";

interface ApplicantsPageProps {
    params: {
        job_description_id: string;
    };
}

type Applicant = {
    candidate_email?: string;
    candidate_first_name?: string;
    candidate_last_name?: string;
    primary_skills?: string[] | string;
    [key: string]: any;
};

const ApplicantsPage: React.FC<ApplicantsPageProps> = ({ params }) => {
    const jobId = Number(params.job_description_id);

    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ["applicant-resumes", jobId],
        queryFn: () => getApplicantResumes(jobId),
        enabled: !!jobId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        // refetch on page show (back-forward cache) and visibility
        const handlePageShow = (e: any) => {
            if (e && e.persisted) refetch();
        };
        const handleVisibility = () => {
            if (document.visibilityState === "visible") refetch();
        };
        if (typeof window !== "undefined") {
            window.addEventListener("pageshow", handlePageShow);
            document.addEventListener("visibilitychange", handleVisibility);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("pageshow", handlePageShow);
                document.removeEventListener("visibilitychange", handleVisibility);
            }
        };
    }, [refetch]);

    // Read JD title from query param passed during navigation
    const [jdTitle, setJdTitle] = useState<string>("");
    useEffect(() => {
        try {
            const sp = new URLSearchParams(window.location.search);
            const titleParam = sp.get("title");
            if (titleParam) setJdTitle(titleParam);
        } catch (_e) {}
    }, [jobId]);

    const applicants: Applicant[] = useMemo(() => {
        try {
            const raw = data?.data as any;
            if (Array.isArray(raw)) return raw as Applicant[];
            if (Array.isArray(raw?.applicants)) return raw.applicants as Applicant[];
            if (Array.isArray(raw?.data)) return raw.data as Applicant[];
            return [];
        } catch (e) {
            return [];
        }
    }, [data?.data]);

    const renderSkills = (skills: Applicant["primary_skills"]) => {
        if (!skills) return "-";
        if (Array.isArray(skills)) return skills.join(", ");
        return String(skills);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto mt-10">
            <div className="mb-4">
                <NavigateBack href={`/job-description/${jobId}`} />
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h1 className="text-2xl font-bold">Applicants{jdTitle ? ` • ${jdTitle}` : ""}</h1>
                    <p className="text-sm mt-1 opacity-90">
                        {isFetching ? "Loading applicants..." : `${applicants.length} applicant(s)`}
                    </p>
                </div>

                <div className="p-6">
                    {isError && (
                        <div className="p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
                            Failed to load applicants. Please try again.
                        </div>
                    )}

                    {!isFetching && applicants.length === 0 && !isError && (
                        <div className="p-6 text-center text-gray-600">No applicants yet.</div>
                    )}

                    <ul className="space-y-4">
                        {applicants.map((appl: Applicant, idx: number) => {
                            const first = appl.candidate_first_name || appl.first_name || "";
                            const last = appl.candidate_last_name || appl.last_name || "";
                            const email = appl.candidate_email || appl.email || "-";
                            const skills = renderSkills(appl.primary_skills);

                            return (
                                <li key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {first || last ? `${first} ${last}`.trim() : email}
                                            </div>
                                            <div className="text-sm text-gray-600">{email}</div>
                                        </div>
                                        <div className="text-sm text-gray-800 max-w-xl">
                                            <span className="font-medium">Primary skills: </span>
                                            <span>{skills}</span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ApplicantsPage;