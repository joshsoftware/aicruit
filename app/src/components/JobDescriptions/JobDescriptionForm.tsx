"use client"
import React, { useState, ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { useParseJobDescription } from "@/services/JobDescription/hooks";
import { Button } from "@/components/ui/button";
import DisplayUploadedFile from "../ui/DisplayUploadFile";
import { MAX_FILE_SIZE_MB } from "@/constants/constants";

interface JobDescriptionPayload {
  title: string;
  jd_file?: File;
  file_url?: string;
}

interface FormState {
  title: string;
  jd_file: File | null;
  file_url: string;
  uploadType: "file" | "url";
  fileError: string | null;
}

const JobDescriptionForm = () => {
  const { sendParseJobDescriptionRequest, isJobCreating, disableSubmit } =
    useParseJobDescription();
  const [formData, setFormData] = useState<FormState>({
    title: "",
    jd_file: null,
    file_url: "",
    uploadType: "file",
    fileError: null,
  });

  const [fileName, setFileName] = useState<string | null>(null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setFormData((prev) => ({
          ...prev,
          fileError: "File size exceeds 10 MB",
          jd_file: null,
        }));
        return;
      }
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        jd_file: file,
        file_url: "",
        fileError: null,
      }));
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      file_url: e.target.value,
      jd_file: null,
    }));
  };

  const handleUploadTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUploadType = e.target.value as "file" | "url";
    setFormData((prev) => ({
      ...prev,
      uploadType: newUploadType,
      jd_file: null,
      file_url: "",
      fileError: null,
    }));
    setFileName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: JobDescriptionPayload = {
      title: formData.title,
    };

    if (formData.uploadType === "file" && formData.jd_file) {
      payload.jd_file = formData.jd_file;
    } else if (formData.uploadType === "url" && formData.file_url) {
      payload.file_url = formData.file_url;
    }

    await sendParseJobDescriptionRequest(payload);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-slate-50 rounded-lg shadow-md flex flex-col space-y-6">
        <h1 className="text-xl text-black-primary font- text-center">
          New Job Description
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div>
            <label className="block text-black-secondary font-medium mb-2">
              Job Title
              <input
                required
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter job title"
                className="px-3 py-2 border rounded-lg w-full mt-2"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="text-black-secondary font-medium mb-2">
              Upload Method
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="file"
                checked={formData.uploadType === "file"}
                onChange={handleUploadTypeChange}
                className="w-4 h-4 mt-2 text-purple-dark"
              />
              <span className="text-sm text-gray-700">Upload File</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="url"
                checked={formData.uploadType === "url"}
                onChange={handleUploadTypeChange}
                className="w-4 h-4 text-purple-dark"
              />
              <span className="text-sm text-gray-700">Paste Link</span>
            </label>
          </div>

          {formData.uploadType === "file" && (
            <div className="border-2 border-dashed border-purple-dark rounded-lg p-4 text-center relative mt-2">
              <Upload className="mx-auto mb-2 text-purple-dark" size={28} />
              <p className="text-gray-700 text-sm">
                Drag and Drop or{" "}
                <span className="text-purple-dark cursor-pointer">
                  Choose file
                </span>{" "}
                to upload
              </p>
              <p className="text-xs text-gray-500">
                .docs, .pdf are supported (Max 10 MB)
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              {formData.fileError && (
                <p className="text-red-500 text-sm mt-2">
                  {formData.fileError}
                </p>
              )}
            </div>
          )}

          {formData.uploadType === "url" && (
            <div>
              <label className="block text-black-secondary font-medium mb-2">
                Upload Link
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={handleUrlChange}
                  placeholder="Enter document URL"
                  className="px-3 py-2 border rounded-lg w-full"
                />
              </label>
            </div>
          )}

          {fileName && formData.uploadType === "file" && (
            <div className="mt-4">
              <DisplayUploadedFile
                fileName={fileName}
                onDelete={() => setFileName(null)}
              />
            </div>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              disabled={
                disableSubmit ||
                (formData.uploadType === "file"
                  ? !formData.jd_file
                  : !formData.file_url)
              }
              className="w-full px-4 py-2 text-base text-white bg-purple-dark rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJobCreating ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing data...
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
};

export default JobDescriptionForm;
