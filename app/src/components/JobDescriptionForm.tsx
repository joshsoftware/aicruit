import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { jobDescriptionSchema } from "@/validators/job-description";
import { MAX_FILE_SIZE_MB } from "@/constants/constants";
import UploadedFile from "./UploadFile";
import { toast } from "sonner";

export interface JobDescriptionFormData {
  title: string;
  uploadType: "file" | "link";
  file?: File;
  fileURL?: string;
}

function JobDescriptionForm() {
  const form = useForm<JobDescriptionFormData>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      title: "",
      uploadType: "file",
      file: undefined,
      fileURL: "",
    },
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const uploadType = form.watch("uploadType");

  const handleFileDelete = () => {
    form.setValue("file", undefined);
    setFileName(null);
  };

  const handleSubmit = (data: JobDescriptionFormData) => {
    if (
      data.uploadType === "file" &&
      data.file &&
      data.file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    ) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }
    // onSubmit(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col space-y-6">
        <h1 className="text-xl text-black-primary font-bold text-center">
          New Job Description
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black-secondary">
                    Job title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter job title"
                      className="px-3 py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uploadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black-secondary">
                    Upload Method
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value="file"
                          checked={field.value === "file"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 text-purple-dark"
                        />
                        <span className="text-sm text-gray-700">
                          Upload File
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value="link"
                          checked={field.value === "link"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 text-purple-dark"
                        />
                        <span className="text-sm text-gray-700">
                          Paste Link
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadType === "file" && (
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <div className="border-2 border-dashed border-purple-dark rounded-lg p-4 text-center relative">
                      <Upload
                        className="mx-auto mb-2 text-purple-dark"
                        size={28}
                      />
                      <p className="text-gray-700 text-sm">
                        Drag and Drop or{" "}
                        <span className="text-purple-dark cursor-pointer">
                          Choose file
                        </span>{" "}
                        to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        .docs, .pdf are supported (Max {MAX_FILE_SIZE_MB} MB)
                      </p>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            form.setValue("file", file);
                            setFileName(file.name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf, .docx"
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {uploadType === "link" && (
              <FormField
                control={form.control}
                name="fileURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-secondary">
                      Upload a link
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Paste link here"
                        className="px-3 py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {fileName && uploadType === "file" && (
              <div className="mt-8">
                <UploadedFile fileName={fileName} onDelete={handleFileDelete} />
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full px-4 py-2 mt-6 text-base text-white bg-purple-dark rounded hover:bg-purple-800"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default JobDescriptionForm;
