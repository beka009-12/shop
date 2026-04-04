import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "..";

const useSearch = (params: SearchParams) => {
  return useInfiniteQuery({
    queryKey: ["search", params],
    queryFn: async ({ pageParam = 1 }) => {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          query.set(key, String(value));
        }
      });

      query.set("page", String(pageParam));

      const res = await api.get<SearchResult>(`/search/products?${query}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 30,
  });
};

export default useSearch;
