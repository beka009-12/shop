import { useCallback } from "react";
import { useOrderCreate } from "@/api/order";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import { useAddFavorite } from "@/api/favorite";

// ! TODO: add to cart
export const useCartAddAction = () => {
  const { data: me } = useGetMe();
  const { mutateAsync: createOrder } = useOrderCreate();

  const handleAddToCart = useCallback(
    async (productId: number) => {
      if (!me?.user?.id) {
        toast.error("Вы не авторизованы");
        return;
      }

      try {
        await createOrder({
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

        toast.success("Товар успешно добавлен в корзину");
      } catch (err: any) {
        if (err?.response?.status === 409) {
          toast.error("Товар уже добавлен в корзину");
          return;
        }

        console.error(err);
        toast.error("Ошибка при добавлении товара в корзину");
      }
    },
    [createOrder, me?.user],
  );

  return {
    addToCart: handleAddToCart,
  };
};

// ! TODO : delete from cart
export const useFavoriteFun = () => {
  const { data: me } = useGetMe();
  const { mutateAsync: addFavorite } = useAddFavorite();

  const handleAddFavorite = useCallback(
    async (productId: number) => {
      if (!me?.user?.id) {
        toast.error("Вы не авторизованы");
        return;
      }

      try {
        await addFavorite({
          userId: me.user.id,
          productId,
        });

        if (!me?.user?.id) {
          toast.error("Вы не авторизованы");
          return;
        }

        toast.success("Товар успешно добавлен в избранное");
      } catch (error) {
        console.log(error);
        toast.error("Ошибка при добавлении товара в избранное");
      }
    },
    [me?.user, addFavorite],
  );
  return {
    addToFavorite: handleAddFavorite,
  };
};
