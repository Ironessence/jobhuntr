import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserContext } from "@/context/AuthContext";
import { useMutateApi } from "@/lib";
import { handleApiError } from "@/utils/error-handling";
import QueryKeys from "@/utils/queryKeys";
import { RefreshCcwIcon } from "lucide-react";
import { ChangeEvent, useRef } from "react";
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
      handleApiError(error as Response, "updating resume");
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      await generateCvSuggestions({
        cvText: user?.cv_full_text,
        email: user?.email,
      });
    } catch (error) {
      handleApiError(error as Response, "generating CV suggestions");
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
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-muted-foreground">
                      AI Suggestions for Resume improvements:
                    </h4>
                    <Button
                      onClick={handleGenerateSuggestions}
                      disabled={isGeneratingCvSuggestions}
                      size="sm"
                      variant="outline"
                    >
                      {isGeneratingCvSuggestions ? (
                        "Generating..."
                      ) : (
                        <>
                          <RefreshCcwIcon className="w-4 h-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
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
                  <Button
                    onClick={handleGenerateSuggestions}
                    disabled={isGeneratingCvSuggestions}
                  >
                    {isGeneratingCvSuggestions ? "Generating..." : "Generate Suggestions"}
                  </Button>
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
