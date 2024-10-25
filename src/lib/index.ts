import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type QueryKeyT = string | readonly unknown[];

/**
 * General GET request hook
 * @param url - The URL to send the request to
 * @param queryKey - The query key to invalidate
 * @param options - The query options
 * @returns The query hook
 * Example of usage:
 *   const { data, isLoading } = useGetQuery<{ coverLetter: string }>(
 *     '/api/getCoverLetter',
 *     ['coverLetter', jobId]
 *   );
 */
export function useGetQuery<TData = unknown, TError = unknown>(
  url: string,
  queryKey: QueryKeyT,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery<TData, TError>({
    queryKey: finalQueryKey,
    queryFn: () =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    ...options,
  });
}

/**
 * General mutation hook (POST/PUT/DELETE)
 * @param url - The URL to send the request to
 * @param queryKey - The query key to invalidate
 * @param options - The mutation options
 * @returns The mutation hook
 * Example of usage:
 *   const { mutate: generateCoverLetter, isLoading } = useMutateApi<{ coverLetter: string }>(
    '/api/generateCoverLetter',
    ['coverLetter', jobId]
  );
 */
export function useMutateApi<TData = unknown, TError = unknown, TVariables = unknown>(
  url: string,
  queryKey: QueryKeyT,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  const finalQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) =>
      fetch(url, {
        method: "POST", // Default to POST, but you can override this in the fetch call if needed
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: finalQueryKey });
      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
    ...options,
  });
}
