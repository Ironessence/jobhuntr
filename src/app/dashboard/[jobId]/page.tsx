"use client";

import { CoverLetterTemplateDialog } from "@/components/shared/CoverLetterTemplateDialog";
import { InterviewQuiz } from "@/components/shared/InterviewQuiz";
import NinjaLoader from "@/components/shared/NinjaLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useGetQuery, useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import { QueryKeys } from "@/utils/queryKeys";
import { ArrowLeftIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function JobDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { user } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);

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

  const { mutateAsync: generateQuestions, isPending: isGeneratingQuestions } = useMutateApi(
    "/api/generate-interview-questions",
    {
      queryKey: [QueryKeys.GENERATE_INTERVIEW_QUESTIONS, jobId],
    },
  );

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

  const handleGenerateQuestions = async () => {
    if (!job || !user) return;

    try {
      const result = await generateQuestions({
        jobTitle: job.jobTitle,
        company: job.company,
        jobDescription: job.jobDescription,
        email: user.email,
      });

      // @ts-expect-error - TODO: Need to fix this
      setQuestions(result.questions);
      setShowQuiz(true);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-4 flex items-center justify-center duration-200 ease-in-out transition-all hover:bg-gray-900 gap-1"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Button>
      {!isLoading && !job && <div>Job not found</div>}
      {!isLoading && job ? (
        <div className="lg:flex justify-center gap-10">
          {/* JOB ACTIONS */}
          <div
            id="job-actions"
            className="flex flex-col flex-1 order-2"
          >
            <h1 className="text-2xl font-bold mt-5 mb-2">Actions</h1>
            <Separator />
            <section className="flex justify-center gap-4 flex-col mb-4 mt-4">
              <Button
                variant="outline"
                className="max-w-fit"
                onClick={() => setIsDialogOpen(true)}
              >
                {job.coverLetter ? "View Cover Letter" : "Generate Cover Letter"}
              </Button>
              <Button
                variant="outline"
                className="max-w-fit"
                onClick={handleGenerateQuestions}
                disabled={isGeneratingQuestions}
              >
                {isGeneratingQuestions ? "Generating..." : "Generate Interview Questions"}
              </Button>
            </section>
            {isGeneratingQuestions && (
              <div className="flex justify-center items-center">
                <NinjaLoader className="w-20 h-20" />
              </div>
            )}
            {showQuiz && questions && (
              <InterviewQuiz
                questions={questions}
                onClose={() => setShowQuiz(false)}
              />
            )}
          </div>
          {/* JOB DETAILS */}
          <div
            id="job-details"
            className="flex flex-col flex-1 order-1"
          >
            <h1 className="text-2xl font-bold mt-5 mb-2">Job Details</h1>
            <Separator />
            <section className="flex justify-between items-center mb-5 mt-4">
              <div>
                <h3 className="text-sm text-gray-500">Job title</h3>
                <h1 className="text-2xl font-bold mb-4">{`${job.jobTitle} @ ${job.company}`}</h1>
              </div>
            </section>

            <div className="mb-4">
              <h3 className="text-sm text-gray-500">Job Description:</h3>
              <p className="whitespace-pre-wrap">{job.jobDescription}</p>
            </div>
          </div>
          <CoverLetterTemplateDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onGenerate={handleGenerateCoverLetter}
            userTokens={user?.tokens || 0}
            existingCoverLetter={job.coverLetter}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-[70vw]">
          <NinjaLoader className="w-20 h-20" />
        </div>
      )}
    </>
  );
}
