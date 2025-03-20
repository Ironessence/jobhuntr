"use client";

import NinjaLoader from "@/components/shared/NinjaLoader";
import HighlightedSegment from "@/components/shared/resume/HighlightedSegment";
import { AIActionButton } from "@/components/ui/ai-action-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { RefreshCcwIcon, UploadIcon } from "lucide-react";
import { NextResponse } from "next/server";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Suggestion = {
  highlighted: string;
  suggestion: string;
};

type TextSegment = {
  text: string;
  suggestionIndex: number | null;
};

export default function ResumePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const [isUploading, setIsUploading] = useState(false);
  const [textSegments, setTextSegments] = useState<TextSegment[]>([]);

  const { mutateAsync: updateResume, isPending: isUpdatingResume } = useMutateApi(
    "/api/update-cv",
    {
      queryKey: QueryKeys.UPDATE_CV,
      invalidate: QueryKeys.GET_USER,
    },
  );

  const { mutateAsync: generateCvSuggestions, isPending: isGeneratingCvSuggestions } = useMutateApi(
    "/api/analyzeCv",
    {
      queryKey: QueryKeys.ANALYZE_CV,
      invalidate: QueryKeys.GET_USER,
    },
  );

  const processResumeText = useCallback(() => {
    if (!user?.cv_full_text) return;

    const fullText = user.cv_full_text;
    const suggestions = (user.cv_suggestions as Suggestion[]) || [];

    if (suggestions.length === 0) {
      setTextSegments([{ text: fullText, suggestionIndex: null }]);
      return;
    }

    // Create a copy of the suggestions with their original indices
    const indexedSuggestions = suggestions.map((suggestion, index) => ({
      ...suggestion,
      originalIndex: index,
    }));

    // Sort suggestions by the length of highlighted text (longest first)
    // This helps prevent shorter matches from being prioritized over longer ones
    const sortedSuggestions = [...indexedSuggestions].sort((a, b) => {
      return b.highlighted.length - a.highlighted.length;
    });

    // Create segments
    const segments: TextSegment[] = [];

    // Create a "marked" version of the text to track which parts have been processed
    const markedText = fullText;
    const markedPositions: { start: number; end: number; suggestionIndex: number }[] = [];

    // First pass: Find all matches and mark their positions
    sortedSuggestions.forEach((suggestion) => {
      // Normalize the highlighted text
      const normalizedHighlight = suggestion.highlighted.replace(/\s+/g, " ").trim();

      // Create a regex that's more flexible with whitespace
      const escapedText = normalizedHighlight
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\s+/g, "\\s+");

      const regex = new RegExp(escapedText, "gi");

      let match;
      while ((match = regex.exec(fullText)) !== null) {
        // Check if this match overlaps with any existing marked positions
        const start = match.index;
        const end = start + match[0].length;

        const overlaps = markedPositions.some((pos) => start < pos.end && end > pos.start);

        if (!overlaps) {
          markedPositions.push({
            start,
            end,
            suggestionIndex: suggestion.originalIndex,
          });
        }
      }
    });

    // Sort marked positions by their start index
    markedPositions.sort((a, b) => a.start - b.start);

    // Second pass: Create segments based on marked positions
    let lastIndex = 0;

    markedPositions.forEach((position) => {
      // Add text before the marked position
      if (position.start > lastIndex) {
        segments.push({
          text: fullText.slice(lastIndex, position.start),
          suggestionIndex: null,
        });
      }

      // Add the highlighted text
      segments.push({
        text: fullText.slice(position.start, position.end),
        suggestionIndex: position.suggestionIndex,
      });

      lastIndex = position.end;
    });

    // Add any remaining text
    if (lastIndex < fullText.length) {
      segments.push({
        text: fullText.slice(lastIndex),
        suggestionIndex: null,
      });
    }

    setTextSegments(segments);
  }, [user?.cv_full_text, user?.cv_suggestions]);

  useEffect(() => {
    if (user?.cv_full_text && user?.cv_suggestions) {
      processResumeText();
    }
  }, [processResumeText, user?.cv_full_text, user?.cv_suggestions]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Please upload a CV that is less than 2MB (approximately 5 pages).",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      setIsUploading(true);
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result?.toString().split(",")[1];
        await updateResume({
          fileName: file.name,
          fileData: base64String,
          email: user?.email,
          isReplacing: true,
        });
        toast.success("Resume uploaded successfully");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      handleApiError(error as NextResponse, "updating resume");
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      await generateCvSuggestions({
        cvText: user?.cv_full_text,
        email: user?.email,
      });
      toast.success("Resume analysis completed");
    } catch (error) {
      handleApiError(error as NextResponse, "generating CV suggestions");
    }
  };

  if (!user?.cv_file_name) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No Resume Added</CardTitle>
            <CardDescription>
              Start by adding your resume and let&apos;s make it awesome!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center mb-4">
              Upload your resume to get AI-powered suggestions for improvement and make your resume
              stand out to potential employers.
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading || isUpdatingResume}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              disabled={isUploading || isUpdatingResume}
            >
              {isUploading || isUpdatingResume ? (
                <NinjaLoader />
              ) : (
                <UploadIcon className="w-4 h-4" />
              )}
              {isUploading || isUpdatingResume ? "Uploading..." : "Upload Resume"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col items-center justify-center max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Resume</h1>

      <div className="flex gap-3 items-center justify-between mb-8 bg-card p-4 rounded-lg border w-full">
        <div>
          <h3 className="font-medium">File name:</h3>
          <p className="text-muted-foreground">{user?.cv_file_name}</p>
        </div>
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading || isUpdatingResume}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isUploading || isUpdatingResume}
        >
          {isUploading || isUpdatingResume ? (
            <NinjaLoader />
          ) : (
            <RefreshCcwIcon className="w-4 h-4 mr-1" />
          )}
          {isUploading || isUpdatingResume ? "Uploading..." : "Replace"}
        </Button>
      </div>

      <div className="w-full mb-2 flex justify-center">
        <AIActionButton
          onClick={handleGenerateSuggestions}
          isGenerating={isGeneratingCvSuggestions}
          existingData={user?.cv_suggestions!.length > 0}
          price={constants.PRICE_CV_SUGGESTIONS}
        />
      </div>

      {user?.cv_suggestions && (user.cv_suggestions as Suggestion[]).length > 0 && (
        <div className="flex items-center justify-center bg-yellow-600/60 p-4 rounded-lg mt-2 mb-6">
          <ExclamationTriangleIcon className="w-8 h-8 mr-2" />
          <p className="text-center text-white  max-w-xl ">
            Looks like we found some improvements you can make. Click on each individual highlight
            to see what our trained AI suggested.
          </p>
        </div>
      )}

      <Card className="w-full">
        <CardContent className="pt-6">
          {user?.cv_suggestions && (user.cv_suggestions as Suggestion[]).length === 0 ? (
            <div className="text-center py-4 mb-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xl font-medium text-green-600 dark:text-green-400 mb-2">
                Everything looks perfect!
              </p>
              <p className="text-muted-foreground">
                Your resume is well-crafted and ready for job applications. Good luck!
              </p>
            </div>
          ) : null}

          <div className="whitespace-pre-wrap text-muted-foreground bg-muted/50 p-4 rounded-lg">
            {textSegments.map((segment, index) => {
              if (segment.suggestionIndex !== null && user?.cv_suggestions) {
                const suggestion = (user.cv_suggestions as Suggestion[])[segment.suggestionIndex];

                return (
                  <HighlightedSegment
                    key={index}
                    text={segment.text}
                    suggestion={suggestion.suggestion}
                  />
                );
              }

              return <span key={index}>{segment.text}</span>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
