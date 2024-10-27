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
 * @param options - The query options - queryKey and enabled
 * @returns The query hook
 * Example of usage:
 *   const { data, isLoading } = useGetQuery<{ coverLetter: string }>(
 *     '/api/getCoverLetter',
 *     ['coverLetter', jobId]
 *   );
 */
export function useGetQuery<TData = unknown, TError = unknown>(
  url: string,
  options: {
    queryKey: QueryKeyT;
    enabled?: boolean;
  },
  queryOptions?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "enabled">,
) {
  const finalQueryKey = Array.isArray(options.queryKey) ? options.queryKey : [options.queryKey];

  return useQuery<TData, TError>({
    queryKey: finalQueryKey,
    queryFn: () =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    enabled: options.enabled ?? true,
    ...queryOptions,
  });
}

/**
 * General mutation hook (POST/PUT/DELETE)
 * @param url - The URL to send the request to
 * @param options - An object containing queryKey and invalidate options
 * @param mutationOptions - The mutation options
 * @returns The mutation hook
 */
export function useMutateApi<TData = unknown, TError = unknown, TVariables = unknown>(
  url: string,
  options: {
    queryKey: QueryKeyT;
    invalidate?: QueryKeyT | QueryKeyT[];
  },
  mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  const finalMutationKey = Array.isArray(options.queryKey) ? options.queryKey : [options.queryKey];
  const invalidateKeys = options.invalidate
    ? Array.isArray(options.invalidate)
      ? options.invalidate
      : [options.invalidate]
    : [];

  return useMutation<TData, TError, TVariables>({
    mutationKey: finalMutationKey,
    mutationFn: (variables) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: (...args) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
      });
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(...args);
      }
    },
    ...mutationOptions,
  });
}
