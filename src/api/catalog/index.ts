import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetCategoriesTree = () => {
  return useQuery<
    CatalogAPI.GetCategoriesTreeRes,
    CatalogAPI.GetCategoriesTreeReq
  >({
    queryKey: ["categoriesTree"],
    queryFn: async () => {
      const response = await api.get("/category/categories-tree");
      return response.data;
    },
  });
};

export { useGetCategoriesTree };
