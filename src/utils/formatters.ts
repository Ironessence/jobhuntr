import { JobStatus } from "@/types/Job.types";

export const formatJobStatus = (status: JobStatus): string => {
  const statusMap: Record<JobStatus, string> = {
    [JobStatus.ADDED]: "Added",
    [JobStatus.APPLIED]: "Applied",
    [JobStatus.REJECTED]: "Rejected",
    [JobStatus.INTERVIEWING]: "Interviewing",
    [JobStatus.OFFER_RECEIVED]: "Offer Received",
  };

  return statusMap[status];
};

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Validate if date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
