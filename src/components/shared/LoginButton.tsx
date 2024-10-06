'use client';

import { Button } from "@/components/ui/button";
import { SessionProvider, useSession } from "next-auth/react";
import { useState } from "react";
import LoginDialog from "./LoginDialog";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (status === "loading") {
    return null; // Or return a loading spinner
  }

  if (session) {
    return null; // Don't show login button if user is already logged in
  }

  return (
    
    <SessionProvider>
      <Button onClick={() => setShowLoginDialog(true)}>Login</Button>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </SessionProvider>
    
  );
}