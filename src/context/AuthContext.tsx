"use client";

import { useToast } from "@/hooks/use-toast";
import { useGetQuery } from "@/lib";
import { User } from "@/types/User.types";
import QueryKeys from "@/utils/queryKeys";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const initialState = {
  user: undefined,
  refreshUser: () => {},
  isLoading: false,
  isDialogOpen: false,
  setIsDialogOpen: () => {},
};

type InitialStateType = {
  user?: User;
  refreshUser: () => void;
  isLoading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
};

const AuthContext = createContext<InitialStateType>(initialState);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const {toast} = useToast();
 
    const {data: userData, isError, isLoading, isSuccess} = useGetQuery<User>(`/api/getUser/${session?.user?.email}`, {
      queryKey: QueryKeys.GET_USER,
      enabled: !!session?.user?.email,
    });

  // The function is used to both get the user and also refresh the user data for example for displaying the new tokens
  const refreshUser = useCallback(async () => {
    if (isSuccess) {
     
      setUser(userData);
    }
    if (isError) {
      toast({
        title: "Unable to retrieve user data!",
        description: "Please try again later. If the problem persists, contact support.",
      });
      router.push("/");
    }
  }, [isError, isSuccess, router, toast, userData]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser, router, session?.user?.email]);

  const value = {
    user,
    refreshUser,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);