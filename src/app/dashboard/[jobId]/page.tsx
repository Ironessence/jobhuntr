"use client";

import CompanyInsights from "@/components/shared/company-insights/CompanyInsights";
import JobCoverLetter from "@/components/shared/cover-letter/JobCoverLetter";
import InterviewArea from "@/components/shared/interview-prep/InterviewArea";
import NinjaLoader from "@/components/shared/NinjaLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePageTracking } from "@/hooks/usePageTracking";
import { useGetQuery, useMutateApi } from "@/lib";
import { Job, JobStatus } from "@/types/Job.types";
import { formatDate, formatJobStatus } from "@/utils/formatters";
import { QueryKeys } from "@/utils/queryKeys";
import { ArrowLeftIcon, Building2, FileText, MessageSquare, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const {
    data: job,
    isLoading,
    isSuccess,
  } = useGetQuery<Job>(`/api/getJob/${jobId}`, {
    queryKey: [QueryKeys.GET_JOB, jobId],
    enabled: !!jobId && !!session?.user?.email,
  });

  const { mutateAsync: updateStatus } = useMutateApi("/api/updateJobStatus", {
    queryKey: [QueryKeys.UPDATE_JOB_STATUS, jobId],
    invalidate: [QueryKeys.GET_JOB, jobId],
    method: "POST",
  });

  const { mutateAsync: deleteJob } = useMutateApi("/api/deleteJob", {
    queryKey: QueryKeys.DELETE_JOB,
    invalidate: QueryKeys.GET_JOBS,
    method: "POST",
  });

  // Add page tracking with job details when available
  usePageTracking("job_details", {
    job_id: jobId,
    job_title: job?.jobTitle,
    company: job?.company,
    job_status: job?.status,
  });

  const handleStatusChange = async (newStatus: JobStatus) => {
    try {
      await updateStatus({
        jobId,
        status: newStatus,
        email: session?.user?.email,
      });
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

  const handleDeleteJob = async () => {
    try {
      await deleteJob({
        jobId,
        email: session?.user?.email,
      });
      router.push("/dashboard");
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <>
      <Button
        onClick={() => router.back()}
        className="mb-4 flex items-center justify-center duration-200 ease-in-out transition-all gap-1"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Button>
      {!isLoading && !job && isSuccess && <div>Job not found</div>}
      {!isLoading && job ? (
        <div className="flex flex-col max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-0">
              <div>
                <h1 className="text-3xl font-bold">{`${job.jobTitle} @ ${job.company}`}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 mr-auto md:mr-0">
                <Select
                  value={job.status}
                  onValueChange={(value) => handleStatusChange(value as JobStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      {job.status ? formatJobStatus(job.status as JobStatus) : "Select status"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {formatJobStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this job and all
                        its related data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteJob}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <Separator className="my-4" />

            {/* Actions Tabs */}
            <Tabs
              defaultValue="cover-letter"
              className="w-full mb-10"
            >
              <TabsList className="grid grid-cols-3 h-16 sm:h-24 bg-background">
                <TabsTrigger
                  value="cover-letter"
                  className="flex flex-col gap-1 sm:gap-2 data-[state=active]:bg-muted px-1 sm:px-2"
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="flex flex-col text-center">
                    <span className="text-sm sm:text-base font-semibold">Cover Letter</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Create an AI-powered cover letter
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="flex flex-col gap-1 sm:gap-2 data-[state=active]:bg-muted px-1 sm:px-2"
                >
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="flex flex-col text-center">
                    <span className="text-sm sm:text-base font-semibold">Insights</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Get AI-generated insights
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="interview"
                  className="flex flex-col gap-1 sm:gap-2 data-[state=active]:bg-muted px-1 sm:px-2"
                >
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="flex flex-col text-center ">
                    <span className="text-sm sm:text-base font-semibold">Interview Prep</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Practice with AI questions
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="cover-letter"
                className="mt-6"
              >
                <JobCoverLetter job={job} />
              </TabsContent>

              <TabsContent
                value="company"
                className="mt-6"
              >
                <CompanyInsights job={job} />
              </TabsContent>

              <TabsContent
                value="interview"
                className="mt-6"
              >
                <InterviewArea job={job} />
              </TabsContent>
            </Tabs>
            <Separator className="my-4" />
            <p className="whitespace-pre-wrap text-muted-foreground mb-8">{job.jobDescription}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <NinjaLoader className="w-20 h-20" />
        </div>
      )}
    </>
  );
}
