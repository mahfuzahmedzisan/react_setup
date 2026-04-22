import { useInfiniteQuery } from '@tanstack/react-query';

import type { FetchPaginatedPage } from '@/lib/pagination/types';

export function useInfiniteWindowQuery<T>(options: {
  queryKey: readonly unknown[];
  fetchPage: FetchPaginatedPage<T>;
  staleTime?: number;
}) {
  const { queryKey, fetchPage, staleTime = 60_000 } = options;

  return useInfiniteQuery({
    queryKey: [...queryKey],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => fetchPage(pageParam as number, signal),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime,
  });
}
