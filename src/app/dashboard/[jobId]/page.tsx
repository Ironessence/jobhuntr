"use client";

import CompanyInsights from "@/components/shared/company-insights/CompanyInsights";
import JobCoverLetter from "@/components/shared/cover-letter/JobCoverLetter";
import InterviewArea from "@/components/shared/interview-prep/InterviewArea";
import NinjaLoader from "@/components/shared/NinjaLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetQuery } from "@/lib";
import { Job } from "@/types/Job.types";
import { QueryKeys } from "@/utils/queryKeys";
import { ArrowLeftIcon, Building2, FileText, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

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
      {!isLoading && !job && isSuccess && <div>Job not found</div>}
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
