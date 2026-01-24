import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useOrderCreate = () => {
  return useMutation<ORDER.CreateOrderRes, Error, ORDER.CreateOrderReq>({
    mutationFn: async (data) => {
      const response = await api.post<ORDER.CreateOrderRes>(
        "/order/create-order",
        data,
      );
      return response.data;
    },
  });
};

const useGetOrders = (userId: number) => {
  return useQuery<ORDER.CartItemRes[], Error>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await api.get<ORDER.CartItemRes[]>(
        `/order/cart/${userId}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

const useDeleteAllOrder = () => {
  return useMutation<ORDER.DeleteAllOrderRes, Error, ORDER.DeleteAllOrderReq>({
    mutationFn: async ({ userId }) => {
      const response = await api.delete<ORDER.DeleteAllOrderRes>(
        `/order/delete-all-cart/${userId}`,
      );
      return response.data;
    },
  });
};

export { useOrderCreate, useGetOrders, useDeleteAllOrder };
