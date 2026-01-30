import { useCallback } from "react";
import { useDeleteAllOrder, useGetOrders, useOrderCreate } from "@/api/order";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import { useAddFavorite } from "@/api/favorite";

// ! TODO: add to cart
export const useCartAddAction = () => {
  const { data: me } = useGetMe();
  const { mutateAsync: createOrder } = useOrderCreate();

  const handleAddToCart = useCallback(
    (productId: number) => {
      if (!me?.user?.id) {
        toast.error("Вы не авторизованы");
        return;
      }

      const promise = createOrder({
        userId: me.user.id,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
        deliveryName: me.user.name || "Покупатель",
        deliveryPhone: me.user.phone || "Не указан",
        deliveryAddress: "Не указан",
      });

      toast.promise(promise, {
        loading: "Добавляем в корзину...",
        success: "Товар добавлен в корзину 🛒",
        error: (err: any) => {
          if (err?.response?.status === 409) {
            return "Товар уже в корзине";
          }
          return "Ошибка при добавлении товара в корзину";
        },
      });

      return promise;
    },
    [createOrder, me?.user?.id],
  );

  return {
    addToCart: handleAddToCart,
  };
};

// ! TODO: delete from cart
export const useCartDeleteAction = () => {
  const { data: me } = useGetMe();
  const { mutateAsync: deleteAllOrder } = useDeleteAllOrder();
  const { data: orders } = useGetOrders(me?.user?.id!); // получаем корзину

  const handleDeleteFromCart = useCallback(() => {
    if (!me?.user?.id) {
      toast.error("Вы не авторизованы");
      return;
    }

    if (!orders || orders.length === 0) {
      toast("Корзина уже пуста ⚠️");
      return;
    }

    const promise = deleteAllOrder({ userId: me.user.id });

    toast.promise(promise, {
      loading: "Удаление...",
      success: "Корзина очищена 🛒",
      error: "Ошибка при очистке корзины",
    });

    return promise;
  }, [deleteAllOrder, me?.user?.id, orders]);

  return {
    deleteAllFromCart: handleDeleteFromCart,
  };
};

//  TODO : add to favoritet
export const useFavoriteFun = () => {
  const { data: me } = useGetMe();
  const { mutateAsync: addFavorite } = useAddFavorite();

  const handleAddFavorite = useCallback(
    (productId: number) => {
      if (!me?.user?.id) {
        toast.error("Вы не авторизованы");
        return;
      }

      const promise = addFavorite({
        userId: me.user.id,
        productId,
      });

      toast.promise(promise, {
        loading: "Добавляем в избранное...",
        success: "Товар добавлен в избранное ❤️",
        error: (error: number | any) => {
          if (error?.response?.status === 409) {
            return "Товар уже в избранном";
          }
          return "Ошибка при добавлении в избранное";
        },
      });

      return promise;
    },
    [me?.user?.id, addFavorite],
  );

  return {
    addToFavorite: handleAddFavorite,
  };
};
