"use client";

import addIcon from "@/assets/icons/icon-add2.png";
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
import { useGetQuery, useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import { User } from "@/types/User.types";
import QueryKeys from "@/utils/queryKeys";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: jobs } = useGetQuery<Job[]>(`/api/getJobs/${session?.user?.email}`, {
    queryKey: QueryKeys.GET_JOBS,
    enabled: !!session?.user?.email,
  });
  const { data: user } = useGetQuery<User>(`/api/getUser/${session?.user?.email}`, {
    queryKey: QueryKeys.GET_USER,
    enabled: !!session?.user?.email,
  });
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <NinjaLoader className="w-20 h-20" />;
  }

  if (!session || !session.user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await saveJob({ jobTitle, company, jobDescription, email: session?.user?.email })
      .then(() => {
        setJobSaved(true);
        setIsSubmitting(false);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error saving job:", error);
        setIsSubmitting(false);
      })
      .finally(() => {
        setJobDescription("");
        setCompany("");
        setJobTitle("");
      });
  };

  return (
    <div className="mx-auto p-4">
      <section className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Image
            src={addIcon}
            alt="Add new job"
            width={16}
            height={16}
          />
          Add New Job
        </Button>
      </section>

      {/* Add New Job Card */}
      {jobs && jobs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              // jobId={job._id}
              job={job}
            />
          ))}
        </div>
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
        <DialogContent className={`max-w-[90%] rounded-xl border-0 overflow-y-auto`}>
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
