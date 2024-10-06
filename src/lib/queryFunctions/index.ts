//REACT QUERY FUNCTIONS GO HERE

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateCV } from "../clientFunctions";
import { QUERY_KEYS } from "./queryKeys";

export const useGetUser = (email: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, email],
    queryFn: () => getUser(email),
    enabled: !!email,
  });
};

export const useUpdateCV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cv, email }: { cv: string; email: string }) => updateCV(cv, email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER],
      });
    },
  });
};
