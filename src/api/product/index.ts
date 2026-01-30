import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetProduct = (params?: ProductAPI.useGetProductForUserReq) => {
  return useQuery<ProductAPI.useGetProductForUserRes, Error>({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get("/commodity/products-for-user", {
        params,
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Получить продукт по ID
const useGetProductById = (id: number) => {
  return useQuery<ProductAPI.useGetProductByIdRes, Error>({
    queryKey: ["productById", id],
    queryFn: async () => {
      const response = await api.get(`/commodity/product-for-user/${id}`); // ✅ Изменили эндпоинт
      return response.data.product;
    },
    enabled: !!id,
  });
};

const useGetSimilarProducts = (categoryId: number) => {
  return useQuery<ProductAPI.useGetSimilarProductsRes, Error>({
    queryKey: ["similarProducts", categoryId],
    queryFn: async () => {
      const response = await api.get(
        `/commodity/similar-products/${categoryId}`,
      );
      return response.data;
    },
    enabled: !!categoryId,
  });
};

export { useGetProduct, useGetProductById, useGetSimilarProducts };
