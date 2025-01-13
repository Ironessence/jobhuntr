"use client";

import { CoverLetterTemplateDialog } from "@/components/shared/CoverLetterTemplateDialog";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useGetQuery } from "@/lib";
import { QueryKeys } from "@/utils/queryKeys";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  _id: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  coverLetter?: string;
}

export default function JobDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { user } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetQuery<Job>(`/api/getJob/${jobId}`, {
    queryKey: [QueryKeys.GET_JOB, jobId],
    enabled: !!jobId && !!session?.user?.email,
  });

  const handleGenerateCoverLetter = async () => {
    if (!job || !user) return;

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: job.jobDescription,
          email: user.email,
          jobId: jobId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();

      // Refetch job data to get updated cover letter
      await refetch();

      return data;
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return <div>Error loading job details: {(error as Error).message}</div>;
  }
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto p-4">
      <section className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-sm text-gray-500">Job title</h3>
          <h1 className="text-2xl font-bold mb-4">{`${job.jobTitle} @ ${job.company}`}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </section>
      <section className="flex justify-center gap-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          {job.coverLetter ? "View Cover Letter" : "Generate Cover Letter"}
        </Button>
        <Button>Generate Tailored Resume</Button>
        <Button>Generate Interview Questions</Button>
      </section>
      <div className="mb-4">
        <h3 className="text-sm text-gray-500">Job Description:</h3>
        <p className="whitespace-pre-wrap">{job.jobDescription}</p>
      </div>
      <CoverLetterTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onGenerate={handleGenerateCoverLetter}
        userTokens={user?.tokens || 0}
        existingCoverLetter={job.coverLetter}
      />
    </div>
  );
}
