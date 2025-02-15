import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";

import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";
import NinjaLoader from "../NinjaLoader";
import { SalaryRangeSelector } from "./SalaryRangeSelector";
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
      handleApiError(error as NextResponse, "generating company insights");
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-0">
            <StarRating rating={job.companyInsights.rating} />
            <SalaryRangeSelector job={job} />
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
                  <ul className="space-y-2">
                    {job.companyInsights.prosAndCons.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-green-600 dark:text-green-400">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cons</h4>
                  <ul className="space-y-2">
                    {job.companyInsights.prosAndCons.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2"
                      >
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-red-600 dark:text-red-400">{con}</span>
                      </li>
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
