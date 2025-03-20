"use client";
import DashboardHeader from "@/components/shared/DashboardHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto p-5 sm:p-10">
      <DashboardHeader />
      {children}
    </div>
  );
}
