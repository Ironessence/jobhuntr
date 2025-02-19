import token from "@/assets/icons/icon-shuriken.png";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button, ButtonProps } from "./button";

interface AIActionButtonProps extends ButtonProps {
  price: number;
  isGenerating?: boolean;
  existingData?: any;
  className?: string;
}

export function AIActionButton({
  price,
  isGenerating,
  existingData,
  className,
  ...props
}: AIActionButtonProps) {
  return (
    <Button
      className={cn("gap-2 text-md font-normal", className)}
      disabled={isGenerating}
      {...props}
    >
      {isGenerating ? (
        "Generating..."
      ) : (
        <>
          {existingData ? "Regenerate" : "Generate"}
          <span className="flex items-center gap-1 font-bold ">
            {price}
            <Image
              src={token}
              alt="coins"
              width={16}
              height={16}
            />
          </span>
        </>
      )}
    </Button>
  );
}
