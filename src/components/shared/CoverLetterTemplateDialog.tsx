"use client";

import template1 from "@/assets/images/coins1.png";
import template2 from "@/assets/images/coins2.png";
import template3 from "@/assets/images/coins3.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";

const templates = [
  { id: 1, name: "Professional", image: template1 },
  { id: 2, name: "Modern", image: template2 },
  { id: 3, name: "Creative", image: template3 },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (templateId: number) => Promise<void>;
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
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!existingCoverLetter);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

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
      await onGenerate(selectedTemplate);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {existingCoverLetter && !showTemplateSelector
              ? "Your Cover Letter"
              : "Select Cover Letter Template"}
          </DialogTitle>
          <DialogDescription>
            {existingCoverLetter && !showTemplateSelector
              ? "Review your generated cover letter or generate a new one"
              : "Choose a template for your cover letter. This will cost 100 tokens."}
          </DialogDescription>
        </DialogHeader>

        {existingCoverLetter && !showTemplateSelector ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowTemplateSelector(true)}
              className="w-full"
            >
              Regenerate Cover Letter
            </Button>
            <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap p-4 border rounded-lg">
              {existingCoverLetter}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 py-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all
                    ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <Image
                    src={template.image}
                    alt={template.name}
                    className="rounded-md"
                    width={200}
                    height={280}
                  />
                  <p className="mt-2 text-center text-sm font-medium">{template.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">Available tokens: {userTokens}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (existingCoverLetter) {
                      setShowTemplateSelector(false);
                    } else {
                      onClose();
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || isGenerating || userTokens < 100}
                >
                  {isGenerating ? "Generating..." : "Generate Cover Letter"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
