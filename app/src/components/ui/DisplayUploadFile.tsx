import Image from "next/image";

interface DisplayUploadedFileProps {
  fileName: string;
  onDelete: () => void;
}

const DisplayUploadedFile: React.FC<DisplayUploadedFileProps> = ({
  fileName,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg mt-2 shadow-md">
      <Image height={25} width={25} src={"/file-icon.svg"} alt="file icon" />
      <span className="text-gray-700 text-sm">{fileName}</span>
      <Image
        height={25}
        width={25}
        src={"/delete-icon.svg"}
        className="cursor-pointer"
        onClick={onDelete}
        alt="delete icon"
      />
    </div>
  );
};

export default DisplayUploadedFile;
