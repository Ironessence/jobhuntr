"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMutateApi } from "@/lib";
import { InterviewQuestion, Job } from "@/types/Job.types";
import { QueryKeys } from "@/utils/queryKeys";
import { RefreshCcw } from "lucide-react";
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
    invalidate: [QueryKeys.GET_JOB, job._id],
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
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {!job.interviewQuestions ? (
        <Button
          onClick={handleGenerateQuestions}
          disabled={isGeneratingQuestions}
          className="flex items-center gap-2 mb-4"
        >
          {isGeneratingQuestions ? "Generating..." : "Generate Interview Questions"}
        </Button>
      ) : (
        <>
          <Button
            className="mb-4 flex items-center gap-1"
            onClick={handleGenerateQuestions}
            disabled={isGeneratingQuestions}
          >
            <RefreshCcw className="w-4 h-4" />
            {isGeneratingQuestions ? "Generating..." : "Regenerate Questions"}
          </Button>
          {!isGeneratingQuestions &&
            job.interviewQuestions &&
            job.interviewQuestions.length > 0 && (
              <InterviewQuiz questions={job.interviewQuestions} />
            )}
        </>
      )}
      {isGeneratingQuestions && (
        <div className="flex justify-center items-center mt-4">
          <NinjaLoader className="w-20 h-20" />
        </div>
      )}
    </div>
  );
}
