"use client";

import { AuthContextProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

// Extend the Window interface to include queryClient
declare global {
  interface Window {
    queryClient?: QueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });

    // Make queryClient available globally
    if (typeof window !== "undefined") {
      window.queryClient = client;
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <AuthContextProvider>{children}</AuthContextProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
