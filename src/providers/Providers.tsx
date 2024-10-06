"use client";

import { SessionProvider } from "next-auth/react";
import QueryProvider from "./QueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
    </QueryProvider>
  );
};

export default Providers;