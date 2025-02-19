import { cn } from "@/lib/utils";
import { Job, JobStatus } from "@/types/Job.types";
import { shortenDescription } from "@/utils";
import { formatDate, formatJobStatus } from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  const cardClasses = cn(
    "shadow-xl rounded-lg p-6 mb-4 border min-h-[200px] duration-300 cursor-pointer",
    "dark:border-gray-800 border-gray-400",
    "dark:hover:shadow-gray-800 hover:shadow-gray-400",
    job.status === JobStatus.REJECTED && "opacity-60 bg-gray-100 dark:bg-gray-900",
  );

  const textClasses = cn(job.status === JobStatus.REJECTED && "text-muted-foreground");

  return (
    <div
      className={cardClasses}
      onClick={() => router.push(`/dashboard/${job._id}`)}
    >
      <Badge
        variant={
          job.status === JobStatus.REJECTED
            ? "destructive"
            : job.status === JobStatus.INTERVIEWING
              ? "default"
              : job.status === JobStatus.OFFER_RECEIVED
                ? "success"
                : "secondary"
        }
        className="mb-4"
      >
        {formatJobStatus(job.status)}
      </Badge>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={cn("text-xl font-semibold dark:text-white text-gray-900", textClasses)}>
            {job.jobTitle}
          </h2>
          <p className={cn("dark:text-gray-400 text-gray-700", textClasses)}>{job.company}</p>
        </div>
      </div>
      <p className={cn("dark:text-gray-400 text-gray-700 mb-4", textClasses)}>
        {shortenDescription(job.jobDescription)}
      </p>
      <div
        className={cn(
          "flex justify-between items-center text-xs text-muted-foreground",
          textClasses,
        )}
      >
        <span>Created on {formatDate(job.createdAt)}</span>
      </div>
    </div>
  );
}
