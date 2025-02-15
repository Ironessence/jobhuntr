import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type QueryKeyT = QueryKey | string | readonly unknown[];

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
        if (!res.ok) throw res;
        return res.json();
      }),
    enabled: options.enabled ?? true,
    ...queryOptions,
  });
}

interface MutateApiOptions {
  queryKey: QueryKeyT;
  invalidate?: QueryKeyT | QueryKeyT[];
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
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
  options: MutateApiOptions,
  mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  const { queryKey, invalidate, method = "POST" } = options;

  return useMutation<TData, TError, TVariables>({
    mutationKey: [queryKey],
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        throw response;
      }

      return response.json();
    },
    onSuccess: (data: TData, variables: TVariables, context: unknown) => {
      if (invalidate) {
        const invalidateKeys = Array.isArray(invalidate) ? invalidate : [invalidate];
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
    ...mutationOptions,
  });
}
