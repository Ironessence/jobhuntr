'use client';

import addIcon from '@/assets/icons/icon-add.png';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetJobs } from '@/lib/queryFunctions';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: jobs, isLoading: jobsLoading } = useGetJobs(session?.user?.email || "");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobSaved, setJobSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/saveJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, jobDescription, email: session?.user?.email }),
      });
      
      if (response.ok) {
        setJobSaved(true);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Add New Job Card */}
     {jobs && jobs.jobs.length > 0 ? (
      <div>
        {jobs.jobs.map((job: any) => (
          <div key={job._id}>{job.jobTitle}</div>
        ))}
      </div>
     ) : (<div 
        className="border-2 border-dashed rounded-lg p-8 flex items-center justify-center cursor-pointer max-w-[400px]"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="text-center flex flex-col items-center">
          <Image src={addIcon} alt="Add new job" width={50} height={50} /> 
          <p>Add new job</p>
        </div>
      </div>)}

      {/* New Job Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{jobSaved ? "Job Saved" : "Add New Job"}</DialogTitle>
          </DialogHeader>
          {!jobSaved ? (
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={isSubmitting}
                className="mb-4"
              />
              <Input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isSubmitting}
                className="mb-4"
              />
              <Textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isSubmitting}
                className="mb-4 resize-none"
                rows={6}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Matching..." : "Match"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div>
              <p className="mb-4">Job has been saved successfully!</p>
              <Button onClick={() => {/* Implement cover letter creation */}}>
                Create cover letter
              </Button>
              <Button onClick={() => {/* Implement interview prep */}}>
                Interview prep
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
