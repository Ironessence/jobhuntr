//REACT QUERY FUNCTIONS GO HERE

import { CvProcessResponse } from "@/types/Cv.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCv, getJobs, getUser, updateCV } from "../clientFunctions";
import { QUERY_KEYS } from "./queryKeys";

export const useGetUser = (email: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, email],
    queryFn: () => getUser(email),
    enabled: !!email,
  });
};

export const useGetCv = (email: string) => {
  return useQuery<CvProcessResponse>({
    queryKey: [QUERY_KEYS.GET_CV, email],
    queryFn: () => getCv(email),
    enabled: !!email,
  });
};

export const useUpdateCV = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CvProcessResponse,
    Error,
    { fileName: string; fileType: string; fileData: string; email: string; isReplacing: boolean }
  >({
    mutationFn: (fileData: {
      fileName: string;
      fileType: string;
      fileData: string;
      email: string;
      isReplacing: boolean;
    }) => updateCV(fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CV],
      });
    },
  });
};

export const useGetJobs = (email: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOBS, email],
    queryFn: () => getJobs(email),
    enabled: !!email,
  });
};
