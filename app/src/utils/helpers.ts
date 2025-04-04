export const formatDate = (isoString?: string): string => {
  if (!isoString) return "N/A";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
};
