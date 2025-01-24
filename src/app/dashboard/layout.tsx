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
    <div className="mx-auto p-5 sm:p-10">
      <DashboardHeader setIsResumeDialogOpen={setIsResumeDialogOpen} />
      {children}
      <ResumeDialog
        isDialogOpen={isResumeDialogOpen}
        setIsDialogOpen={setIsResumeDialogOpen}
      />
    </div>
  );
}
