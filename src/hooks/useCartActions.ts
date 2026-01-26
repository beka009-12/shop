import { useCallback } from "react";
import { useOrderCreate } from "@/api/order";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";

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
