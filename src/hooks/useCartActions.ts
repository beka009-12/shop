import { getGetFavoriteFavoriteUserIdQueryKey } from "./../api/generated/endpoints/favorite/favorite";
import { useCallback } from "react";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteOrderDeleteAllCartUserId,
  useGetOrderCartUserId,
  usePostOrderCreateOrder,
  getGetOrderCartUserIdQueryKey,
} from "@/api/generated/endpoints/order/order";
import {
  useDeleteFavoriteFavoriteDeleteProductId,
  usePostFavoriteFavoriteAdd,
} from "@/api/generated/endpoints/favorite/favorite";

export const useCartAddAction = () => {
  const { data: me } = useGetMe();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { mutateAsync: createOrder } = usePostOrderCreateOrder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetOrderCartUserIdQueryKey(Number(userId)),
        });
      },
    },
  });

  const handleAddToCart = useCallback(
    (productId: number) => {
      const promise = createOrder({ data: { productId, quantity: 1 } });
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
    [createOrder],
  );

  return { addToCart: handleAddToCart };
};

export const useCartDeleteAction = () => {
  const { data: me } = useGetMe();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { data: orders } = useGetOrderCartUserId(Number(userId));

  const { mutateAsync: deleteAllOrder } = useDeleteOrderDeleteAllCartUserId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetOrderCartUserIdQueryKey(Number(userId)),
        });
      },
    },
  });

  const handleDeleteFromCart = useCallback(() => {
    if (!userId) return toast.error("Вы не авторизованы");
    if (!orders || orders.length === 0) return toast("Корзина уже пуста ⚠️");

    const promise = deleteAllOrder({ userId });
    toast.promise(promise, {
      loading: "Удаление...",
      success: "Корзина очищена 🛒",
      error: "Ошибка при очистке корзины",
    });
    return promise;
  }, [deleteAllOrder, userId, orders]);

  return { deleteAllFromCart: handleDeleteFromCart };
};

export const useFavoriteFun = () => {
  const { data: me } = useGetMe();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { mutateAsync: addFavorite } = usePostFavoriteFavoriteAdd({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFavoriteFavoriteUserIdQueryKey(Number(userId)),
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
  const { data: me } = useGetMe();
  const userId = me?.user?.id;
  const queryClient = useQueryClient();

  const { mutateAsync: deleteFavorite, isPending } =
    useDeleteFavoriteFavoriteDeleteProductId({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetFavoriteFavoriteUserIdQueryKey(Number(userId)),
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
