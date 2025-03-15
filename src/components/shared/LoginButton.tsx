"use client";

import { Button } from "@/components/ui/button";
import { SessionProvider, useSession } from "next-auth/react";

import { LoginDialog } from "../auth/LoginDialog";
import NinjaLoader from "./NinjaLoader";

export default function LoginButton({
  setIsLoginDialogOpen,
  isLoginDialogOpen,
}: {
  setIsLoginDialogOpen: (open: boolean) => void;
  isLoginDialogOpen: boolean;
}) {
  const { data: session, status } = useSession();
  //const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (status === "loading") {
    return <NinjaLoader className="w-20 h-20" />;
  }

  if (session) {
    return null; // Don't show login button if user is already logged in
  }

  return (
    <SessionProvider>
      <Button onClick={() => setIsLoginDialogOpen(true)}>Login</Button>
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </SessionProvider>
  );
}
