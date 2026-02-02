import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetAllStores = (params?: StoreAPI.GetStoresRequest) => {
  return useQuery<StoreAPI.GetStoresResponse>({
    queryKey: ["stores", params],
    queryFn: async () => {
      const response = await api.get("/saller/all-stores", { params });
      return response.data;
    },
  });
};

export { useGetAllStores };
