"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const NinjaLoader = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "w-40 h-40 animate-ninja-spin",
        theme === "dark" ? "text-white" : "text-white",
        className,
      )}
      style={{
        background: `
          conic-gradient(from  165deg at top   ,#0000, currentColor 1deg 30deg,#0000 31deg) top,
          conic-gradient(from   75deg at left  ,#0000, currentColor 1deg 30deg,#0000 31deg) left,
          conic-gradient(from  -15deg at bottom,#0000, currentColor 1deg 30deg,#0000 31deg) bottom, 
          conic-gradient(from -105deg at right ,#0000, currentColor 1deg 30deg,#0000 31deg) right
        `,
        backgroundSize: "100% 50%, 50% 100%",
        WebkitMask: "radial-gradient(circle 10px,#0000 90%,#000)",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

export default NinjaLoader;
