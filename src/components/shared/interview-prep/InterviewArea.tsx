"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { InterviewQuestion, Job } from "@/types/Job.types";
import { handleApiError } from "@/utils/error-handling";
import { QueryKeys } from "@/utils/queryKeys";
import { RefreshCcw } from "lucide-react";
import { NextResponse } from "next/server";
import NinjaLoader from "../NinjaLoader";
import { InterviewQuiz } from "./InterviewQuiz";

interface Props {
  job: Job;
}

export default function InterviewArea({ job }: Props) {
  const { user } = useUserContext();

  const { mutateAsync: generateQuestions, isPending: isGeneratingQuestions } = useMutateApi<
    InterviewQuestion[]
  >("/api/generate-interview-questions", {
    queryKey: [QueryKeys.GENERATE_INTERVIEW_QUESTIONS, job._id],
    invalidate: [QueryKeys.GET_JOB, job._id, QueryKeys.GET_USER],
  });

  const handleGenerateQuestions = async () => {
    if (!job || !user) return;

    try {
      await generateQuestions({
        jobTitle: job.jobTitle,
        company: job.company,
        jobDescription: job.jobDescription,
        email: user.email,
        jobId: job._id,
        currentQuestions: job.interviewQuestions,
      });
    } catch (error) {
      handleApiError(error as NextResponse, "generating interview questions");
    }
  };

  return (
    <div>
      <Button
        onClick={handleGenerateQuestions}
        disabled={isGeneratingQuestions}
        className="flex items-center gap-2 mb-4"
      >
        {job.interviewQuestions && job.interviewQuestions.length > 0 && (
          <RefreshCcw className="w-4 h-4" />
        )}
        {job.interviewQuestions && job.interviewQuestions.length > 0
          ? "Regenerate Interview Questions"
          : "Generate Interview Questions"}
      </Button>

      {!isGeneratingQuestions && job.interviewQuestions && job.interviewQuestions.length > 0 && (
        <InterviewQuiz questions={job.interviewQuestions} />
      )}

      {isGeneratingQuestions && (
        <div className="flex flex-col justify-center items-center mt-4">
          <NinjaLoader className="w-20 h-20" />
          <p className="text-sm text-gray-500">Please wait. This may take up to one minute.</p>
        </div>
      )}
    </div>
  );
}
