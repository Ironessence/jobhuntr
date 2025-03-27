"use client";

import { JobCard } from "@/components/shared/JobCard";

import NinjaLoader from "@/components/shared/NinjaLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { constants } from "@/constants";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useGetQuery, useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import { User } from "@/types/User.types";
import QueryKeys from "@/utils/queryKeys";
import { FileText, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Add page tracking
  usePageTracking("dashboard", {
    user_status: status,
    has_session: !!session,
  });

  const { data: jobs } = useGetQuery<Job[]>(`/api/getJobs/${session?.user?.email}`, {
    queryKey: QueryKeys.GET_JOBS,
    enabled: !!session?.user?.email,
  });

  // Get user data to check if CV exists
  const { data: user } = useGetQuery<User>(`/api/getUser/${session?.user?.email}`, {
    queryKey: QueryKeys.GET_USER,
    enabled: !!session?.user?.email,
  });

  const hasCV = user?.cv_file_name;

  // Sort jobs by dateAdded (newest first)
  const sortedJobs = jobs
    ? [...jobs].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
    : null;

  const { mutateAsync: saveJob } = useMutateApi("/api/saveJob", {
    queryKey: QueryKeys.SAVE_JOB,
    invalidate: QueryKeys.GET_JOBS,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobSaved, setJobSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user has made a payment
  const hasSuccessfulPayment = user?.paymentHistory?.some(
    (payment) => payment.status === "succeeded" || payment.status === "completed",
  );

  // Determine job limit based on payment status
  const jobLimit = hasSuccessfulPayment ? constants.LIMIT_JOBS : constants.LIMIT_JOBS_FREE;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center mt-20 max-w-3xl mx-auto">
        <NinjaLoader className="w-20 h-20" />
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  // Filter jobs based on search query
  const filteredJobs = sortedJobs
    ? sortedJobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = (await saveJob({
        jobTitle,
        company,
        jobDescription,
        email: session?.user?.email,
      })) as { jobId: string; message: string };

      setJobSaved(true);
      setIsSubmitting(false);
      setIsDialogOpen(false);

      // Clear form
      setJobDescription("");
      setCompany("");
      setJobTitle("");

      // Navigate to the new job using the returned jobId
      if (response.jobId) {
        router.push(`/dashboard/${response.jobId}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      setIsSubmitting(false);
    }
  };

  const handleAddNewJobClick = () => {
    if (jobs && jobs.length >= jobLimit) {
      if (hasSuccessfulPayment) {
        toast.error("Job limit reached", {
          description: `You have reached your limit of ${constants.LIMIT_JOBS} jobs. Please delete existing jobs to add more.`,
          duration: 5000,
        });
      } else {
        toast("Free limit reached", {
          description: `You've reached the free usage limit of ${constants.LIMIT_JOBS_FREE} jobs. Remove existing jobs or make a payment to add up to ${constants.LIMIT_JOBS} jobs.`,
          action: {
            label: "🚀 Buy Tokens",
            onClick: () => router.push("/dashboard/buy-tokens"),
          },
          duration: 5000,
        });
      }
      return;
    }

    // If under the limit, open the dialog
    setIsDialogOpen(true);
  };

  return (
    <div className="mx-auto p-4">
      {sortedJobs && sortedJobs.length === 0 && !user?.cv_file_name && (
        <div className="mx-auto p-4 max-w-2xl">
          <div className="flex flex-col items-center justify-center py-10 text-center bg-gradient-to-br from-blue-900/5 to-purple-900/5 border border-blue-500/20 rounded-xl p-8 shadow-md">
            <div className="mb-6 w-32 h-32 relative">
              <FileText className="w-full h-full text-blue-500" />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full -z-10"></div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              Let&apos;s Get Started!
            </h2>

            <p className="text-lg mb-6 text-foreground/90">
              To start enjoying the AI benefits of ApplyNinja, let&apos;s add your resume so the AI
              can start analyzing it and helping you out on your job search journey. You can start
              adding jobs right after.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/dashboard/resume")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upload Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAddNewJobClick()}
              >
                Skip & Add Job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Show message when no jobs exist */}
      {sortedJobs && sortedJobs.length === 0 && user?.cv_file_name && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-2xl font-semibold mb-2">No jobs to display here</p>
          <p className="text-muted-foreground mb-6">
            Create your first job and enjoy applying like a ninja
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Your First Job
          </Button>
        </div>
      )}

      {/* Add job limit indicator */}
      {sortedJobs && sortedJobs.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>

          <Button
            onClick={handleAddNewJobClick}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Job
          </Button>
        </div>
      )}

      {/* Show job grid when jobs exist */}
      {sortedJobs && sortedJobs.length > 0 && (
        <>
          {filteredJobs && filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-xl font-semibold mb-2">No matching jobs found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search query</p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2"
              >
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}

      {/* New Job Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setIsDialogOpen(false);
          setJobDescription("");
          setJobTitle("");
          setCompany("");
        }}
      >
        <DialogContent className={`max-w-[90%] md:max-w-[50%] rounded-xl border-0 overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>{jobSaved ? "Job Saved" : "Add New Job"}</DialogTitle>
            <DialogDescription>Create a new job to get started.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isSubmitting}
              className="mb-4"
            />
            <Input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isSubmitting}
              className="mb-4"
            />

            <Textarea
              placeholder="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isSubmitting}
              className={`mb-4 w-full resize-none ${jobDescription.length > 300 ? "h-[400px]" : "h-[150px]"} scrollbar-gutter-stable`}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
