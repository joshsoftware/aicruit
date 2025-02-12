import JobDescriptionForm from "@/components/JobDescriptions/JobDescriptionForm";
import NavigateBack from "@/components/NavigateBack";

export default function Page() {
  return (
    <div className="flex flex-col w-full pt-2">
      <div className="flex justify-start w-full mb-4">
        <NavigateBack />
      </div>
      <JobDescriptionForm />
    </div>
  );
}
