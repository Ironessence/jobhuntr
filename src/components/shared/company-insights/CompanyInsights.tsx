import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import QueryKeys from "@/utils/queryKeys";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import NinjaLoader from "../NinjaLoader";
import { StarRating } from "./StarRating";

const formatSalary = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CompanyInsights = ({ job }: { job: Job }) => {
  const { user } = useUserContext();
  const params = useParams();
  const jobId = params.jobId as string;

  const { mutateAsync: generateInsights, isPending: isGeneratingInsights } = useMutateApi(
    "/api/generate-insights",
    {
      queryKey: [QueryKeys.GENERATE_COMPANY_INSIGHTS, jobId],
      invalidate: [QueryKeys.GET_JOB, jobId],
    },
  );

  const handleGenerateInsights = async () => {
    if (!job || !user) return;

    try {
      await generateInsights({
        company: job.company,
        jobDescription: job.jobDescription,
        email: user.email,
        jobId: jobId,
        role: job.jobTitle,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate company insights",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerateInsights}
        disabled={isGeneratingInsights}
        className="flex items-center gap-2"
      >
        {job.companyInsights && <RefreshCcw className="w-4 h-4" />}
        {job.companyInsights ? "Regenerate Insights" : "Generate Company Insights"}
      </Button>

      {job.companyInsights && !isGeneratingInsights && (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <StarRating rating={job.companyInsights.rating} />
            {job.companyInsights.salaryRange && (
              <div className="text-center sm:text-right">
                <p className="text-sm text-muted-foreground">Estimated Salary Range</p>
                <p className="font-semibold">
                  {formatSalary(
                    job.companyInsights.salaryRange.min,
                    job.companyInsights.salaryRange.currency,
                  )}{" "}
                  -{" "}
                  {formatSalary(
                    job.companyInsights.salaryRange.max,
                    job.companyInsights.salaryRange.currency,
                  )}
                  /year
                </p>
              </div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.companyInsights.overview}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.companyInsights.culture}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.companyInsights.benefits}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.companyInsights.interviewProcess}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Pros</h4>
                  <ul className="list-disc pl-4">
                    {job.companyInsights.prosAndCons.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cons</h4>
                  <ul className="list-disc pl-4">
                    {job.companyInsights.prosAndCons.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {isGeneratingInsights && (
        <div className="flex flex-col justify-center items-center mt-4">
          <NinjaLoader className="w-20 h-20" />
          <p className="text-sm text-gray-500">Please wait. This may take up to one minute.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyInsights;
