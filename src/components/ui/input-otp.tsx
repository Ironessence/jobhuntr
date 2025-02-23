"use client";

import { cn } from "@/lib/utils";
import { OTPInput, OTPInputProps, SlotProps } from "input-otp";
import * as React from "react";

const InputOTP = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("group flex items-center has-[:disabled]:opacity-30", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex", className)}
      {...props}
    />
  ),
);
InputOTPGroup.displayName = "InputOTPGroup";

type InputOTPSlotProps = SlotProps & {
  className?: string;
};

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
    const { placeholderChar, ...otherProps } = props;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-10 h-14 text-[2rem]",
          "flex items-center justify-center",
          "transition-all duration-300",
          "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
          "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
          "outline outline-0 outline-accent-foreground/20",
          isActive && "outline-4 outline-accent-foreground",
          className,
        )}
        {...otherProps}
      >
        {char !== null && <div>{char}</div>}
        {hasFakeCaret && <FakeCaret />}
      </div>
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

// You can emulate a fake textbox caret!
function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-foreground" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
