"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useModifyJobDescription } from "@/services/JobDescription/hooks";
import {
  EditJobDescriptionFormData,
  JobDescription,
} from "@/services/JobDescription/api";

interface JobDescriptionEditFormProps {
  jobDescription: JobDescription;
  onCancel: () => void;
}

interface ParsedData {
  [key: string]: string | string[] | boolean | number | Record<string, any>;
}

const formatSectionTitle = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const JobDescriptionEditForm: React.FC<JobDescriptionEditFormProps> = ({
  jobDescription,
  onCancel,
}) => {
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditJobDescriptionFormData>({
    defaultValues: {
      job_description: {
        id: jobDescription.id,
        title: jobDescription.title,
        parsed_data: { ...jobDescription.parsed_data } as ParsedData,
        status: jobDescription.status,
      },
    },
  });

  const parsedData = watch("job_description.parsed_data") as ParsedData;

  const { isPending, modifyMutate } = useModifyJobDescription(
    jobDescription.id
  );

  useEffect(() => {
    reset({
      job_description: {
        id: jobDescription.id,
        title: jobDescription.title,
        parsed_data: { ...jobDescription.parsed_data } as ParsedData,
        status: jobDescription.status,
      },
    });
  }, [jobDescription, reset]);

  const addNewSection = () => {
    if (newSectionName.trim()) {
      const sectionKey = newSectionName.toLowerCase().replace(/\s+/g, "_");
      const updatedParsedData = {
        ...parsedData,
        [sectionKey]: [""],
      };
      setValue("job_description.parsed_data", updatedParsedData, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setNewSectionName("");
      setShowNewSectionInput(false);
    }
  };

  const addFieldToSection = (sectionKey: string) => {
    const currentSection = parsedData[sectionKey] || [];
    const updatedParsedData = {
      ...parsedData,
      [sectionKey]: Array.isArray(currentSection)
        ? [...currentSection, ""]
        : [""],
    };
    setValue("job_description.parsed_data", updatedParsedData, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeFieldFromSection = (sectionKey: string, index: number) => {
    const currentSection = parsedData[sectionKey];
    if (Array.isArray(currentSection)) {
      const newSection = currentSection.filter((_, i) => i !== index);
      const updatedParsedData = {
        ...parsedData,
        [sectionKey]: newSection,
      };
      setValue("job_description.parsed_data", updatedParsedData, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeSection = (sectionKey: string) => {
    const updatedParsedData = { ...parsedData };
    delete updatedParsedData[sectionKey];
    setValue("job_description.parsed_data", updatedParsedData, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: EditJobDescriptionFormData) => {
    try {
      const formData = JSON.parse(JSON.stringify(data));

      const cleanedParsedData = Object.entries(
        formData.job_description.parsed_data
      ).reduce<ParsedData>((acc, [key, values]) => {
        const nonEmptyValues = (values as string[]).filter(
          (value) => value.trim() !== ""
        );

        if (nonEmptyValues.length > 0) {
          acc[key] = nonEmptyValues;
        }
        return acc;
      }, {});

      const cleanedData = {
        job_description: {
          id: formData.job_description.id,
          title: formData.job_description.title,
          status: formData.job_description.status,
          parsed_data: cleanedParsedData,
        },
      };

      modifyMutate(
        {
          jobId: jobDescription.id,
          body: cleanedData,
        },
        {
          onSuccess: onCancel,
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-white p-6 max-w-5xl mx-auto shadow-lg rounded-lg border-t-4 border-gray-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-indigo-700">
          Edit Job Description
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("job_description.title", {
              required: "Title is required",
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.job_description?.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.job_description.title.message}
            </p>
          )}
        </div>

        {Object.entries(parsedData).map(([sectionKey, values]) => (
          <div key={sectionKey} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-lg font-medium text-gray-700">
                {formatSectionTitle(sectionKey)}
              </label>
              <button
                type="button"
                onClick={() => removeSection(sectionKey)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {Array.isArray(values) &&
                values.map((_, index) => (
                  <div key={`${sectionKey}-${index}`} className="flex gap-2">
                    <Controller
                      name={`job_description.parsed_data.${sectionKey}.${index}`}
                      control={control}
                      defaultValue={values[index]}
                      render={({ field }) => (
                        <input
                          {...field}
                          value={
                            typeof field.value === "string" ||
                            typeof field.value === "number"
                              ? field.value
                              : ""
                          }
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeFieldFromSection(sectionKey, index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => addFieldToSection(sectionKey)}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <FaPlus className="mr-1" size={12} /> Add Field
              </button>
            </div>
          </div>
        ))}
        {showNewSectionInput ? (
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Section Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter section name"
              />
              <button
                type="button"
                onClick={addNewSection}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewSectionInput(false);
                  setNewSectionName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNewSectionInput(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <FaPlus className="mr-2" /> Add New Section
          </button>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobDescriptionEditForm;
