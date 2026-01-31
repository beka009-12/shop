import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation<FavoriteAPI.FavoriteRes, Error, FavoriteAPI.FavoriteReq>({
    mutationFn: async (data) => {
      const response = await api.post("/favorite/favorite-add", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

const useGetFavorites = (userId: number) => {
  return useQuery<FavoriteAPI.GetFavoritesRes, Error>({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const response = await api.get(`/favorite/favorite/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FavoriteAPI.useDeleteFavoriteRes,
    Error,
    FavoriteAPI.useDeleteFavoriteReq
  >({
    mutationFn: async ({ productId }) => {
      const response = await api.delete(
        `/favorite/favorite-delete/${productId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export { useAddFavorite, useGetFavorites, useDeleteFavorite };
