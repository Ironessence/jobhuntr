import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import { RefreshCcwIcon } from "lucide-react";
import { NextResponse } from "next/server";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { AIActionButton } from "../ui/ai-action-button";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const ResumeDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const { mutateAsync: updateResume } = useMutateApi("/api/update-cv", {
    queryKey: QueryKeys.UPDATE_CV,
    invalidate: QueryKeys.GET_USER,
  });
  const { mutateAsync: generateCvSuggestions, isPending: isGeneratingCvSuggestions } = useMutateApi(
    "/api/analyzeCv",
    {
      queryKey: QueryKeys.ANALYZE_CV,
      invalidate: QueryKeys.GET_USER,
    },
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 1MB in bytes
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
      };
      reader.readAsDataURL(file);
    } catch (error) {
      handleApiError(error as NextResponse, "updating resume");
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      await generateCvSuggestions({
        cvText: user?.cv_full_text,
        email: user?.email,
      });
    } catch (error) {
      handleApiError(error as NextResponse, "generating CV suggestions");
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto md:max-w-[30vw] max-w-[90%] rounded-xl md:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resume</DialogTitle>
          <DialogDescription>Manage your resume</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 items-center justify-between">
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
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <RefreshCcwIcon className="w-4 h-4 mr-1" />
            Replace
          </Button>
        </div>

        <Accordion
          type="single"
          collapsible
        >
          <AccordionItem value="suggestions">
            <AccordionTrigger>CV Suggestions</AccordionTrigger>
            <AccordionContent>
              {user?.cv_suggestions && user?.cv_suggestions.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4 sm:flex-row flex-col gap-2">
                    <h4 className="text-md font-medium text-muted-foreground order-2 sm:order-1">
                      AI Suggestions for Resume improvements:
                    </h4>
                    <div className="order-1 sm:order-2 items-start sm:items-end justify-start sm:justify-end w-full sm:w-auto">
                      <AIActionButton
                        onClick={handleGenerateSuggestions}
                        isGenerating={isGeneratingCvSuggestions}
                        existingData={user.cv_suggestions}
                        price={constants.PRICE_CV_SUGGESTIONS}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {user.cv_suggestions.map((suggestion) => (
                      <p
                        key={suggestion}
                        className="text-muted-foreground"
                      >
                        • {suggestion}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">No suggestions found.</p>
                  <AIActionButton
                    onClick={handleGenerateSuggestions}
                    isGenerating={isGeneratingCvSuggestions}
                    price={constants.PRICE_CV_SUGGESTIONS}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content">
            <AccordionTrigger>Resume Content</AccordionTrigger>
            <AccordionContent>
              {user?.cv_file_name ? (
                <div>
                  <p className="whitespace-pre-wrap text-muted-foreground">{user.cv_full_text}</p>
                </div>
              ) : (
                <p>No resume found</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDialog;
