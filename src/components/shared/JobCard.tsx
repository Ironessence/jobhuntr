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
  return (
    <div
      className="shadow-xl rounded-lg p-6 mb-4 border min-h-[200px] dark:border-gray-800 border-gray-400 duration-300  dark:hover:shadow-gray-800 hover:shadow-gray-400 cursor-pointer"
      onClick={() => router.push(`/dashboard/${job._id}`)}
    >
      <Badge
        variant={
          job.status === JobStatus.REJECTED
            ? "destructive"
            : job.status === JobStatus.INTERVIEWING
              ? "default"
              : "secondary"
        }
        className="mb-4"
      >
        {formatJobStatus(job.status)}
      </Badge>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold dark:text-white text-gray-900">{job.jobTitle}</h2>
          <p className="dark:text-gray-400 text-gray-700">{job.company}</p>
        </div>
      </div>
      <p className="dark:text-gray-400 text-gray-700 mb-4">
        {shortenDescription(job.jobDescription)}
      </p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Created on {formatDate(job.createdAt)}</span>
      </div>
    </div>
  );
}
