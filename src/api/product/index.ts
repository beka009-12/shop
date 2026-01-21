import { useQuery } from "@tanstack/react-query";
import { api } from "..";

// Получить все продукты для пользователей (публичный эндпоинт)
const useGetProduct = () => {
  return useQuery<ProductAPI.useGetProductForUserRes, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/commodity/products-for-user"); // ✅ Изменили эндпоинт
      return response.data;
    },
  });
};

// Получить продукт по ID
const useGetProductById = (id: number) => {
  return useQuery<ProductAPI.useGetProductByIdRes, Error>({
    queryKey: ["productById", id],
    queryFn: async () => {
      const response = await api.get(`/commodity/product-for-user/${id}`); // ✅ Изменили эндпоинт
      return response.data.product; // ✅ Вернули product из ответа
    },
    enabled: !!id,
  });
};

export { useGetProduct, useGetProductById };
