import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useOrderCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<ORDER.CreateOrderRes, Error, ORDER.CreateOrderReq>({
    mutationFn: async (data) => {
      const response = await api.post<ORDER.CreateOrderRes>(
        "/order/create-order",
        data,
      );
      return response.data;
    },
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
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
  const queryClient = useQueryClient();

  return useMutation<ORDER.DeleteAllOrderRes, Error, ORDER.DeleteAllOrderReq>({
    mutationFn: async ({ userId }) => {
      const response = await api.delete<ORDER.DeleteAllOrderRes>(
        `/order/delete-all-cart/${userId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const useDeleteById = () => {
  const queryClient = useQueryClient();

  return useMutation<ORDER.DeleteByIdRes, Error, ORDER.DeleteByIdReq>({
    mutationFn: async ({ productId }) => {
      const res = await api.delete<ORDER.DeleteByIdRes>(
        `/order/delete-by-id/${productId}`,
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export { useOrderCreate, useGetOrders, useDeleteAllOrder, useDeleteById };
