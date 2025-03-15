import { NextResponse } from "next/server";
import { toast } from "sonner";

export const handleApiError = async (
  error: NextResponse,
  operation: string = "performing the operation",
) => {
  let errorMessage: string;

  try {
    // For Next.js API responses
    if (error.status === 400 || error.status === 401 || error.status === 500) {
      const data = await error.json();
      errorMessage = data.error;
    }
    // Handle different error formats
    else if (typeof error === "object" && error !== null) {
      // If error is a Response object from fetch
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          errorMessage = errorData.error || error.statusText;
        } catch {
          // If JSON parsing fails, use statusText
          errorMessage = error.statusText;
        }
      }
      // If error already has an 'error' property (common API error format)
      else if (typeof error === "object" && error !== null && "error" in error) {
        errorMessage = (error as { error: string }).error;
      }
      // Fallback for other object formats
      else {
        errorMessage = JSON.stringify(error);
      }
    } else {
      errorMessage = String(error);
    }

    // Handle specific error cases
    if (errorMessage.toLowerCase().includes("insufficient tokens")) {
      toast.error("Insufficient Tokens", {
        description:
          "You don't have enough tokens for this operation. Click here to upgrade your account.",
        action: {
          label: "Upgrade Plan",
          onClick: () => (window.location.href = "/dashboard/upgrade"),
        },
      });
      return;
    }

    if (errorMessage.toLowerCase().includes("failed to update user document")) {
      toast.error("Failed to Save", {
        description: "Unable to save the changes. Please try again.",
      });
      return;
    }

    if (errorMessage.toLowerCase().includes("failed to fetch")) {
      toast.error("Connection Error", {
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
      });
      return;
    }

    if (errorMessage.toLowerCase().includes("email is required")) {
      toast.error("Authentication Error", {
        description: "Please sign in to use this feature.",
      });
      return;
    }

    // Handle all other cases
    toast.error(`Error ${operation}`, {
      description:
        errorMessage || "There was an error. If the problem persists, please contact us.",
    });
  } catch (parseError) {
    console.error("Error parsing error:", parseError);
    toast.error(`Error ${operation}`, {
      description: "There was an error. If the problem persists, please contact us.",
    });
  }
};
