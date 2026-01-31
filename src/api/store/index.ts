import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetAllStores = () => {
  return useQuery<StoreAPI.GetStoresResponse, StoreAPI.GetStoresRequest>({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await api.get("/saller/all-stores");
      return response.data;
    },
  });
};

export { useGetAllStores };
