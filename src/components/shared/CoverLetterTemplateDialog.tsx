"use client";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => Promise<void>;
  userTokens: number;
  existingCoverLetter?: string;
}

export function CoverLetterTemplateDialog({
  isOpen,
  onClose,
  onGenerate,
  userTokens,
  existingCoverLetter,
}: Props) {
  
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    

    if (userTokens < 100) {
      toast({
        title: "Insufficient tokens",
        description: "You need at least 100 tokens to generate a cover letter",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate();
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to generate cover letter",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:min-w-[50vw] sm:h-[80vh] overflow-y-auto h-[80vh] w-[95vw] rounded-md ">
        <DialogHeader>
          <DialogTitle>
            {existingCoverLetter 
              ? "Your Cover Letter"
              : "Create a Cover Letter"}
          </DialogTitle>
          <DialogDescription>
            {existingCoverLetter
              ? "Review your generated cover letter or generate a new one"
              : "Create a cover letter for your job application. This will cost 100 tokens."}
          </DialogDescription>
        </DialogHeader>

        {existingCoverLetter ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => handleGenerate()}
              className="w-fit"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Regenerate Cover Letter"}
            </Button>
            <div className="overflow-y-auto whitespace-pre-wrap p-4 border rounded-lg">
              {existingCoverLetter}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => handleGenerate()}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Create Cover Letter"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
