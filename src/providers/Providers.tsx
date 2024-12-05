"use client";

import { AuthContextProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./QueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AuthContextProvider>
         {children}
      </AuthContextProvider>
    </SessionProvider>
    </QueryProvider>
  );
};

export default Providers;