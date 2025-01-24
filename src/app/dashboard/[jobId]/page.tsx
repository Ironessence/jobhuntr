"use client";

import { InterviewQuiz } from "@/components/shared/InterviewQuiz";
import NinjaLoader from "@/components/shared/NinjaLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useGetQuery, useMutateApi } from "@/lib";
import { InterviewQuestion, Job } from "@/types/Job.types";
import { QueryKeys } from "@/utils/queryKeys";
import { ArrowLeftIcon, Building2, FileText, MessageSquare, RefreshCcw } from "lucide-react";
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
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

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

  const { mutateAsync: generateQuestions, isPending: isGeneratingQuestions } = useMutateApi<
    InterviewQuestion[]
  >("/api/generate-interview-questions", {
    queryKey: [QueryKeys.GENERATE_INTERVIEW_QUESTIONS, jobId],
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

  const handleGenerateQuestions = async () => {
    if (!job || !user) return;

    try {
      await generateQuestions({
        jobTitle: job.jobTitle,
        company: job.company,
        jobDescription: job.jobDescription,
        email: user.email,
        jobId: jobId,
      });

      await refetch(); // Refetch job data to get updated questions
      if (job.interviewQuestions) {
        setQuestions(job.interviewQuestions); // Use the questions from the job object
      }
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
        <div className="flex flex-col max-w-5xl mx-auto">
          {/* Job Details Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{`${job.jobTitle} @ ${job.company}`}</h1>
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
                {job.coverLetter ? (
                  <>
                    <Button
                      variant="default"
                      className="mb-4 flex items-center gap-1 "
                      onClick={handleGenerateCoverLetter}
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Regenerate
                    </Button>
                    <div className="p-4 rounded-lg border bg-muted">
                      <p className="whitespace-pre-wrap">{job.coverLetter}</p>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleGenerateCoverLetter}
                  >
                    Generate Cover Letter
                  </Button>
                )}
              </TabsContent>

              <TabsContent
                value="company"
                className="mt-6"
              >
                <div className="text-center text-muted-foreground">
                  Company insights coming soon...
                </div>
              </TabsContent>

              <TabsContent
                value="interview"
                className="mt-6"
              >
                {!job.interviewQuestions ? (
                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    className="flex items-center gap-2 mb-4"
                  >
                    Generate Interview Questions
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="mb-4 flex items-center gap-1"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Regenerate Questions
                    </Button>
                    <InterviewQuiz questions={job.interviewQuestions || []} />
                  </>
                )}
                {isGeneratingQuestions && (
                  <div className="flex justify-center items-center mt-4">
                    <NinjaLoader className="w-20 h-20" />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <Separator className="my-4" />
            <p className="whitespace-pre-wrap text-muted-foreground mb-8">{job.jobDescription}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[70vw]">
          <NinjaLoader className="w-20 h-20" />
        </div>
      )}
    </>
  );
}
