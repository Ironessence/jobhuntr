"use client";
import DashboardHeader from "@/components/shared/DashboardHeader";
import ResumeDialog from "@/components/shared/ResumeDialog";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader setIsResumeDialogOpen={setIsResumeDialogOpen} />
      {children}
      <ResumeDialog
        isDialogOpen={isResumeDialogOpen}
        setIsDialogOpen={setIsResumeDialogOpen}
      />
    </div>
  );
}
