"use client";

import { AIActionButton } from "@/components/ui/ai-action-button";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { useMutateApi } from "@/lib";
import { InterviewQuestion, Job } from "@/types/Job.types";
import { handleApiError } from "@/utils/error-handling";
import { QueryKeys } from "@/utils/queryKeys";
import { NextResponse } from "next/server";
import NinjaLoader from "../NinjaLoader";
import { InterviewQuiz } from "./InterviewQuiz";

interface Props {
  job: Job;
}

export default function InterviewArea({ job }: Props) {
  const { user } = useUserContext();
  const { trackProgress } = useProgress();
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
      await trackProgress({ type: "INTERVIEW_PREP_GENERATED" });
    } catch (error) {
      handleApiError(error as NextResponse, "generating interview questions");
    }
  };

  return (
    <div>
      <div className="flex">
        <AIActionButton
          onClick={handleGenerateQuestions}
          isGenerating={isGeneratingQuestions}
          existingData={job.interviewQuestions.length > 0}
          price={constants.PRICE_INTERVIEW_QUESTIONS}
          className="mb-4"
        />
      </div>

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
