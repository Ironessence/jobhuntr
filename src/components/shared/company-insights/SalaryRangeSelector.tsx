import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { cn } from "@/lib/utils";
import { Job } from "@/types/Job.types";
import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { countries } from "countries-list";
import "flag-icons/css/flag-icons.min.css";
import { NextResponse } from "next/server";
import { useState } from "react";
import NinjaLoader from "../NinjaLoader";
// Convert countries object to array and sort by name
const countryList = Object.entries(countries)
  .map(([code, data]) => ({
    code,
    name: data.name,
    currency: Array.isArray(data.currency) ? data.currency[0] : data.currency,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  country: string;
}

export function SalaryRangeSelector({ job }: { job: Job }) {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(job.companyInsights?.salaryRange?.country || "");
  const [filteredCountries, setFilteredCountries] = useState(countryList);
  const [salaryRange, setSalaryRange] = useState(job.companyInsights?.salaryRange || null);

  const { mutateAsync: fetchSalaryRange, isPending } = useMutateApi("/api/generate-salary-range", {
    queryKey: [QueryKeys.FETCH_SALARY_RANGE, job._id, value],
  });

  const handleSearch = (input: string) => {
    const searchTerm = input.toLowerCase();
    setFilteredCountries(
      countryList.filter((country) => country.name.toLowerCase().includes(searchTerm)),
    );
  };

  const handleFetchSalaryRange = async () => {
    if (!value || !user) return;

    try {
      const result = await fetchSalaryRange({
        company: job.company,
        role: job.jobTitle,
        country: value,
        email: user.email,
        jobId: job.id,
      });
      setSalaryRange(result as SalaryRange);
    } catch (error) {
      // Reset to original salary range if there's an error
      setSalaryRange(job.companyInsights?.salaryRange || null);
      handleApiError(error as NextResponse, "fetching salary range");
    }
  };

  const formatSalary = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!countryList?.length) return null;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value ? (
                <span className="flex items-center gap-2">
                  <span
                    className={`fi fi-${countryList.find((c) => c.name === value)?.code.toLowerCase()}`}
                  />
                  {value}
                </span>
              ) : (
                "Select country..."
              )}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="border-b px-3 py-2">
              <Input
                placeholder="Search country..."
                className="h-8 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    value === country.name
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => {
                    setValue(country.name);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className={`fi fi-${country.code.toLowerCase()}`} />
                    {country.name}
                  </span>
                  {value === country.name && <CheckIcon className="ml-auto h-4 w-4" />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleFetchSalaryRange}
          disabled={!value || isPending}
        >
          Find Estimated Salary Range
        </Button>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center">
          <NinjaLoader className="w-8 h-8" />
        </div>
      ) : (
        salaryRange && (
          <div className="text-center sm:text-left mx-auto md:ml-auto md:mx-0">
            <p className="text-sm text-muted-foreground">Estimated Salary Range</p>
            <p className="font-semibold">
              {formatSalary(salaryRange.min, salaryRange.currency)} -{" "}
              {formatSalary(salaryRange.max, salaryRange.currency)}/year
            </p>
          </div>
        )
      )}
    </div>
  );
}
