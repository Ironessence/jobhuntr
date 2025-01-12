"use client";

import { Button } from "@/components/ui/button";
import { useGetQuery } from "@/lib";
import { QueryKeys } from "@/utils/queryKeys";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useGetQuery<Job>(`/api/getJob/${jobId}`, {
    queryKey: [QueryKeys.GET_JOB, jobId],
    enabled: !!jobId && !!session?.user?.email,
  });

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
      <div className="mb-4">
        <h3 className="text-sm text-gray-500">Job Description:</h3>
        <p className="whitespace-pre-wrap">{job.jobDescription}</p>
      </div>
      {job.coverLetter && (
        <div>
          <h3 className="font-semibold">Cover Letter:</h3>
          <p className="whitespace-pre-wrap">{job.coverLetter}</p>
        </div>
      )}
    </div>
  );
}
