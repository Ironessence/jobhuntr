import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutateApi } from "@/lib";
import QueryKeys from "@/utils/queryKeys";
import jsPDF from 'jspdf';
import { useRouter } from "next/navigation";
import React from 'react';

interface JobCardProps {
  jobId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  userEmail: string;
}

const JobCard: React.FC<JobCardProps> = ({ jobId, jobTitle, company, jobDescription, userEmail }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isCoverLetterDialogOpen, setIsCoverLetterDialogOpen] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState<string | null>(null);
  const router = useRouter();
  const { mutateAsync: generateCoverLetter, isPending } = useMutateApi<{ coverLetter: string }>(
    '/api/generateCoverLetter',
    {
      queryKey: QueryKeys.GENERATE_COVER_LETTER,
      invalidate: QueryKeys.GET_JOBS,
    },
   
  );

  // Function to shorten the job description
  const shortenDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + '...';
  };

  const handleGenerateCoverLetter = async () => {
    try {
      const result = await generateCoverLetter({ jobId, userEmail });
      setCoverLetter(result.coverLetter);
      setIsCoverLetterDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
    }
  };

 const downloadAsPDF = () => {
    if (coverLetter) {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(jobTitle, 20, 20);
      
      // Add company
      pdf.setFontSize(14);
      pdf.text(company, 20, 30);
      
      // Add cover letter content
      pdf.setFontSize(12);
      pdf.setFont("times", "normal");
      
      const splitText = pdf.splitTextToSize(coverLetter, 170);
      pdf.text(splitText, 20, 40);

      pdf.save('cover_letter.pdf');
    }
  };

   const handleClick = () => {
    router.push(`/dashboard/${jobId}`);
  };

  //TODO: Add functionality to GET the cover letter from the server.

  return (
    <>
      <div 
        className=" shadow-md rounded-lg p-4 mb-4 max-w-sm cursor-pointer hover:shadow-lg transition-shadow border-2 border-gray-300 min-w-[300px]"
        onClick={handleClick}
      >
        <h3 className="font-bold text-lg mb-1">{jobTitle}</h3>
        <p className="text-gray-300 text-sm mb-2">{company}</p>
        <p className="text-gray-400 text-sm">
          {shortenDescription(jobDescription)}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-11/12 h-3/4 flex flex-col" aria-describedby="job-description">
          <DialogHeader>
            <DialogTitle className="text-2xl">{jobTitle}</DialogTitle>
            <DialogDescription className="text-lg">{company}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-hidden mb-4">
            <div className="h-full overflow-y-auto pr-4">
              <p id="job-description" className="text-gray-300 text-base whitespace-pre-wrap">{jobDescription}</p>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap justify-center gap-2">
            <Button 
              className="px-6 py-2" 
              onClick={handleGenerateCoverLetter}
              disabled={isPending}
            >
              {isPending ? "Generating..." : "Generate Cover Letter"}
            </Button>
            <Button className="px-6 py-2">Button 2</Button>
            <Button className="px-6 py-2">Button 3</Button>
            <Button className="px-6 py-2">Button 4</Button>
          </DialogFooter>
         
        </DialogContent>
      </Dialog>
       {/* Cover Letter Dialog */}
      <Dialog open={isCoverLetterDialogOpen} onOpenChange={setIsCoverLetterDialogOpen}>
        <DialogContent className="max-w-4xl w-11/12 h-3/4 flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Generated Cover Letter</DialogTitle>
            <DialogDescription className="text-lg">{jobTitle} - {company}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-hidden mb-4">
            <div className="h-full overflow-y-auto pr-4">
              <p className="text-gray-300 text-base whitespace-pre-wrap">{coverLetter}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={downloadAsPDF}>Download as PDF</Button>
            <Button onClick={() => setIsCoverLetterDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobCard;