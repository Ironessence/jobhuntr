'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { constants } from "@/constants";
import { signIn } from "next-auth/react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Sign in to {constants.APP_TITLE}</DialogTitle>
        </DialogHeader>
        <p id="sign-in-dialog-description" className="sr-only">Sign in to {constants.APP_TITLE}</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}