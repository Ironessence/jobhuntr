import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { useState } from "react";

// Separate component for highlighted text with its own popover state
const HighlightedSegment = ({ text, suggestion }: { text: string; suggestion: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <span className="bg-yellow-100 dark:bg-red-900/90 px-1 rounded cursor-pointer">{text}</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">Suggestion</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm">{suggestion}</p>
      </PopoverContent>
    </Popover>
  );
};

export default HighlightedSegment;
