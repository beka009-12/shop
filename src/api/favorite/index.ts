import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useAddFavorite = () => {
  return useMutation<FavoriteAPI.FavoriteRes, Error, FavoriteAPI.FavoriteReq>({
    mutationFn: async (data) => {
      const response = await api.post("/favorite/favorite-add", data);
      return response.data;
    },
  });
};

const useGetFavorites = () => {
  return useQuery<FavoriteAPI.getFavoritesRes, Error>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.get("/favorite/get-favorite");
      return response.data;
    },
  });
};

export { useAddFavorite };
