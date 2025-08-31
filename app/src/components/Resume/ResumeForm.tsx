"use client";
import React, { useState, ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisplayUploadedFile from "@/components/DisplayUploadFile";
import { MAX_FILE_SIZE_MB } from "@/constants/constants";
import { useUploadResume } from "@/services/Resume/hooks";

interface Props { jobId: number }

type UploadType = "file" | "url";

export default function ResumeForm({ jobId }: Props) {
  const { sendUploadResumeRequest, isSubmitting, disableSubmit } = useUploadResume();

  const [uploadType, setUploadType] = useState<UploadType>("file");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleUploadTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadType(e.target.value as UploadType);
    setResumeFile(null);
    setFileUrl("");
    setFileName(null);
    setFileError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const MAX = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > MAX) {
      setFileError(`File size exceeds ${MAX_FILE_SIZE_MB} MB`);
      setResumeFile(null);
      return;
    }
    setFileError(null);
    setResumeFile(file);
    setFileName(file.name);
    setFileUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendUploadResumeRequest({
      job_description_id: jobId,
      resume_file: uploadType === "file" ? resumeFile ?? undefined : undefined,
      file_url: uploadType === "url" ? (fileUrl || undefined) : undefined,
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-slate-50 rounded-lg shadow-md flex flex-col space-y-6">
        <h1 className="text-xl text-black-primary text-center">Upload Resume</h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="space-y-2">
            <div className="text-black-secondary font-medium mb-2">Upload Method</div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="file"
                checked={uploadType === "file"}
                onChange={handleUploadTypeChange}
                className="w-4 h-4 mt-2 text-purple-dark"
              />
              <span className="text-sm text-gray-700">Upload File</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="url"
                checked={uploadType === "url"}
                onChange={handleUploadTypeChange}
                className="w-4 h-4 text-purple-dark"
              />
              <span className="text-sm text-gray-700">Paste Link</span>
            </label>
          </div>

          {uploadType === "file" && (
            <div className="border-2 border-dashed border-purple-dark rounded-lg p-4 text-center relative mt-2">
              <Upload className="mx-auto mb-2 text-purple-dark" size={28} />
              <p className="text-gray-700 text-sm">
                Drag and Drop or <span className="text-purple-dark cursor-pointer">Choose file</span> to upload
              </p>
              <p className="text-xs text-gray-500">.pdf, .doc, .docx (Max {MAX_FILE_SIZE_MB} MB)</p>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
            </div>
          )}

          {uploadType === "url" && (
            <div>
              <label className="block text-black-secondary font-medium mb-2">
                Resume Link
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Enter document URL"
                  className="px-3 py-2 border rounded-lg w-full"
                />
              </label>
            </div>
          )}

          {fileName && uploadType === "file" && (
            <div className="mt-4">
              <DisplayUploadedFile fileName={fileName} onDelete={() => { setFileName(null); setResumeFile(null); }} />
            </div>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              disabled={disableSubmit || (uploadType === "file" ? !resumeFile : !fileUrl)}
              className="w-full px-4 py-2 text-base text-white bg-purple-dark rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
