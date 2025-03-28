import { AIActionButton } from "@/components/ui/ai-action-button";
import { Button } from "@/components/ui/button";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { useMutateApi } from "@/lib";
import { Job } from "@/types/Job.types";
import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";
import { useEffect, useRef, useState } from "react";
import NinjaLoader from "../NinjaLoader";

const JobCoverLetter = ({ job }: { job: Job }) => {
  const { user } = useUserContext();
  const params = useParams();
  const jobId = params.jobId as string;
  const [content, setContent] = useState(job?.coverLetter || "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { trackProgress } = useProgress();

  const { mutateAsync: generateCoverLetter, isPending: isGeneratingCoverLetter } = useMutateApi(
    "/api/generate-cover-letter",
    {
      queryKey: [QueryKeys.GENERATE_COVER_LETTER, jobId],
      invalidate: [QueryKeys.GET_JOB, QueryKeys.GET_USER, jobId],
    },
  );

  const handleGenerateCoverLetter = async () => {
    if (!job || !user) return;

    try {
      const data = (await generateCoverLetter({
        jobDescription: job.jobDescription,
        email: user.email,
        jobId: jobId,
      })) as { coverLetter: string };

      setContent(data.coverLetter);
      await trackProgress({ type: "COVER_LETTER_GENERATED" });

      // Force height adjustment after content is set
    } catch (error) {
      // Reset content to the original cover letter if there's an error
      setContent(job.coverLetter || "");
      handleApiError(error as NextResponse, "generating cover letter");
    } finally {
      setTimeout(() => {
        adjustHeight();
      }, 1);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "letter",
      orientation: "portrait",
    });

    doc.setFontSize(12);

    // Get and process text immediately
    let text = content;

    // Process special characters for the entire text first
    text = text
      .replace(/ș/g, "s")
      .replace(/ț/g, "t")
      .replace(/î/g, "i")
      .replace(/ă/g, "a")
      .replace(/â/g, "a")
      .replace(/Ș/g, "S")
      .replace(/Ț/g, "T")
      .replace(/Î/g, "I")
      .replace(/Ă/g, "A")
      .replace(/Â/g, "A");

    const margin = 50;
    const normalLineHeight = 16;
    const headerLineHeight = 14;
    let y = margin;

    // Split the processed text
    const allParagraphs = text.split("\n");

    // Find the first empty line that separates header from body
    const headerEndIndex = allParagraphs.findIndex((line, index) => {
      return line.trim() === "" && allParagraphs[index + 1]?.trim() !== "" && index > 2; // Ensure we're not catching early blank lines
    });

    // Split into header and body based on the empty line
    const headerParagraphs = allParagraphs.slice(0, headerEndIndex);
    const bodyParagraphs = allParagraphs.slice(headerEndIndex + 1);

    // Process header with tighter spacing
    headerParagraphs.forEach((paragraph) => {
      if (paragraph.trim()) {
        const lines = doc.splitTextToSize(paragraph, doc.internal.pageSize.width - margin * 2);
        lines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += headerLineHeight;
        });
      }
    });

    // Add space between header and body
    y += normalLineHeight;

    // Process body paragraphs with normal spacing
    bodyParagraphs.forEach((paragraph) => {
      if (paragraph.trim()) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }

        const lines = doc.splitTextToSize(paragraph, doc.internal.pageSize.width - margin * 2);

        lines.forEach((line: string) => {
          doc.text(line, margin, y);
          y += normalLineHeight;
        });

        y += normalLineHeight / 2;
      }
    });

    doc.save(`cover-letter-${job.company}.pdf`);
  };

  const adjustHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (job?.coverLetter) {
      setContent(job.coverLetter);
    }
  }, [job?.coverLetter]);

  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-start items-start sm:justify-start">
        <AIActionButton
          onClick={handleGenerateCoverLetter}
          isGenerating={isGeneratingCoverLetter}
          existingData={job?.coverLetter}
          price={constants.PRICE_COVER_LETTER}
          className="max-w-[250px]"
        />
        {job?.coverLetter && (
          <Button
            variant="outline"
            className="flex items-center gap-1 max-w-[250px] self-center"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        )}
      </div>
      {content && !isGeneratingCoverLetter && (
        <div className="p-8 rounded-lg border bg-gray-200 dark:bg-gray-900 max-w-full mx-auto shadow-sm">
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              adjustHeight();
            }}
            className="w-full bg-transparent border-none focus:outline-none resize-none scrollbar-hidden text-foreground dark:text-white"
            style={{
              lineHeight: "1.5",
              fontSize: "14px",
              padding: "0",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
      )}
      {isGeneratingCoverLetter && (
        <div className="flex flex-col justify-center items-center mt-4">
          <NinjaLoader className="w-20 h-20" />
          <p className="text-sm text-gray-500">Please wait. This may take up to one minute.</p>
        </div>
      )}
    </div>
  );
};

export default JobCoverLetter;
