import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetProduct = () => {
  return useQuery<
    ProductAPI.useGetProductForUserRes,
    ProductAPI.useGetProductForUserReq
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/commodity/products-for-user");
      return response.data;
    },
  });
};

const useGetProductById = (id: number) => {
  return useQuery<
    ProductAPI.useGetProductByIdRes,
    ProductAPI.useGetProductByIdReq
  >({
    queryKey: ["productById", id],
    queryFn: async () => {
      const response = await api.get(`/commodity/product-for-user/${id}`);
      return response.data;
    },
  });
};

const useGetBrandById = (id?: number) => {
  return useQuery<ProductAPI.useGetBrandByIdRes, Error>({
    queryKey: ["get-brands-by-id", id],
    queryFn: async () => {
      const response = await api.get(`/brand/get-brand/${id}`);
      return response.data;
    },
  });
};

export { useGetProduct, useGetProductById, useGetBrandById };
