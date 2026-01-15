import { useMutation } from "@tanstack/react-query";
import { api } from "..";

type FavoriteReq = {
  userId: number;
  productId: number;
};

const useToggleFavorite = () =>
  useMutation({
    mutationFn: async (data: FavoriteReq) => {
      const res = await api.post("/favorite/create-favorite", data);
      return res.data;
    },
  });

const useDeleteFavorite = () =>
  useMutation({
    mutationFn: async (data: FavoriteReq) => {
      const res = await api.post("/favorite/delete-favorite", data);
      return res.data;
    },
  });

export { useToggleFavorite, useDeleteFavorite };
