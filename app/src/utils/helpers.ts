export const formatDate = (isoString?: string): string => {
  if (!isoString) return "N/A";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
};

export const formatResumeStatus = (status: string): string => {
  return status
    .replace(/^hr/, "HR ")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
