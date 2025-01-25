import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import QueryKeys from "@/utils/queryKeys";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import NinjaLoader from "../NinjaLoader";

const JobCoverLetter = ({ job }: { job: Job }) => {
  const { user } = useUserContext();
  const params = useParams();
  const jobId = params.jobId as string;

  const { mutateAsync: generateCoverLetter, isPending: isGeneratingCoverLetter } = useMutateApi(
    "/api/generate-cover-letter",
    {
      queryKey: [QueryKeys.GENERATE_COVER_LETTER, jobId],
      invalidate: [QueryKeys.GET_JOB, jobId],
    },
  );
  const handleGenerateCoverLetter = async () => {
    if (!job || !user) return;

    try {
      const data = await generateCoverLetter({
        jobDescription: job.jobDescription,
        email: user.email,
        jobId: jobId,
      });

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
  return (
    <div>
      {job?.coverLetter ? (
        <>
          <Button
            variant="default"
            className="mb-4 flex items-center gap-1"
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingCoverLetter}
          >
            <RefreshCcw className="w-4 h-4" />
            {isGeneratingCoverLetter ? "Generating..." : "Regenerate"}
          </Button>
          {!isGeneratingCoverLetter && (
            <div className="p-4 rounded-lg border bg-muted">
              <p className="whitespace-pre-wrap">{job.coverLetter}</p>
            </div>
          )}
        </>
      ) : (
        <Button
          variant="outline"
          onClick={handleGenerateCoverLetter}
          disabled={isGeneratingCoverLetter}
        >
          {isGeneratingCoverLetter ? "Generating..." : "Generate Cover Letter"}
        </Button>
      )}
      {isGeneratingCoverLetter && (
        <div className="flex justify-center items-center mt-4">
          <NinjaLoader className="w-15 h-15" />
        </div>
      )}
    </div>
  );
};

export default JobCoverLetter;
