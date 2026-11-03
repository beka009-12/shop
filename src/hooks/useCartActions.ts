import { getGetFavoriteFavoritesQueryKey } from "@/api/generated/endpoints/favorite/favorite";
import { useCallback } from "react";
import { useGetUserProfile } from "@/api/generated/endpoints/user/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteCartClear,
  useGetCart,
  usePostCart,
  getGetCartQueryKey,
} from "@/api/generated/endpoints/cart/cart";
import {
  useDeleteFavoriteFavoriteDeleteProductId,
  usePostFavoriteFavoriteAdd,
} from "@/api/generated/endpoints/favorite/favorite";

export const useCartAddAction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addToCartMutation } = usePostCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
    },
  });

  const handleAddToCart = useCallback(
    (productId: number, quantity = 1) => {
      const promise = addToCartMutation({ data: { productId, quantity } });
      toast.promise(promise, {
        loading: "Добавляем в корзину...",
        success: "Товар добавлен в корзину 🛒",
        error: (err: any) => {
          if (err?.response?.status === 409) return "Товар уже в корзине";
          return "Ошибка при добавлении";
        },
      });
      return promise;
    },
    [addToCartMutation],
  );

  return { addToCart: handleAddToCart };
};

export const useCartDeleteAction = () => {
  const queryClient = useQueryClient();

  const { data: cartData } = useGetCart();

  const { mutateAsync: deleteAllCart } = useDeleteCartClear({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
    },
  });

  const handleDeleteFromCart = useCallback(() => {
    const items = cartData?.items;
    if (!items || items.length === 0) return toast("Корзина уже пуста ⚠️");

    const promise = deleteAllCart();
    toast.promise(promise, {
      loading: "Удаление...",
      success: "Корзина очищена 🛒",
      error: "Ошибка при очистке корзины",
    });
    return promise;
  }, [deleteAllCart, cartData]);

  return { deleteAllFromCart: handleDeleteFromCart };
};

export const useFavoriteFun = () => {
  const { data: me } = useGetUserProfile();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { mutateAsync: addFavorite } = usePostFavoriteFavoriteAdd({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFavoriteFavoritesQueryKey(),
        });
      },
    },
  });

  const handleAddFavorite = useCallback(
    (productId: number) => {
      if (!userId) return toast.error("Вы не авторизованы");
      const promise = addFavorite({ data: { productId } });
      toast.promise(promise, {
        loading: "Добавляем в избранное...",
        success: "Товар добавлен в избранное ❤️",
        error: (err: any) => {
          if (err?.response?.status === 409) return "Товар уже в избранном";
          return "Ошибка при добавлении в избранное";
        },
      });
      return promise;
    },
    [userId, addFavorite],
  );

  return { addToFavorite: handleAddFavorite };
};

export const useDelFavorite = () => {
  const { data: me } = useGetUserProfile();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { mutateAsync: deleteFavorite, isPending } =
    useDeleteFavoriteFavoriteDeleteProductId({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetFavoriteFavoritesQueryKey(),
          });
        },
      },
    });

  const handleRemove = useCallback(
    (productId: number) => {
      if (!userId) return toast.error("Вы не авторизованы");
      const promise = deleteFavorite({ productId });
      toast.promise(promise, {
        loading: "Удаляем из избранного...",
        success: "Товар удален из избранного 🗑️",
        error: (err: any) => {
          if (err?.response?.status === 404) return "Товар уже удален";
          return "Ошибка при удалении";
        },
      });
      return promise;
    },
    [userId, deleteFavorite],
  );

  return { handleRemove, isDeleting: isPending };
};
