"use client";

import PricingSection from "@/components/sections/pricing-section";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function TokenPackages() {
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams?.get("purchase");

  useEffect(() => {
    if (purchaseStatus === "success") {
      toast.success("Token purchase successful!", {
        description: "Your tokens have been added to your account.",
      });
    } else if (purchaseStatus === "cancelled") {
      toast.error("Purchase cancelled", {
        description: "Your token purchase was cancelled. No payment was processed.",
      });
    }
  }, [purchaseStatus]);

  return <PricingSection />;
}

export default function BuyTokensPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenPackages />
    </Suspense>
  );
}
