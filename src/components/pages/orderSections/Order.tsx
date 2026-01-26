"use client";
import { type FC, useState, useEffect } from "react";
import scss from "./Order.module.scss";
import { CartBtn } from "@/utils/ui/GlobalBtn/Btn";
import { useDeleteAllOrder, useDeleteById, useGetOrders } from "@/api/order";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import NotFound from "../../../../public/notFound.png";
import { useRouter } from "next/navigation";

const Order: FC = () => {
  const { data: getMe } = useGetMe();
  const userId = getMe?.user.id;
  const router = useRouter();

  const { data: cartData, isLoading } = useGetOrders(userId!);
  const { mutateAsync: deleteAllOrderAsync, isPending } = useDeleteAllOrder();
  const { mutateAsync: deleteByIdAsync } = useDeleteById();

  const [cartItems, setCartItems] = useState(cartData || []);

  useEffect(() => {
    if (cartData) setCartItems(cartData);
  }, [cartData]);

  if (isLoading) return <div>Загрузка корзины...</div>;

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity!,
    0,
  );

  const handleDeleteAllOrder = async () => {
    if (!userId) {
      toast.error("Не найден userId");
      return;
    }
    if (!cartItems.length) {
      toast.error("Корзина пуста");
      return;
    }
    try {
      await deleteAllOrderAsync({ userId });
      toast.success("Корзина очищена");
    } catch (error) {
      toast.error("Ошибка при очистке корзины");
    }
  };

  const deleteItemById = async (productId: number) => {
    try {
      await deleteByIdAsync({ productId });
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId),
      );
      toast.success("Товар удалён из корзины");
    } catch {
      toast.error("Ошибка при удалении товара");
    }
  };

  const increment = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity! + 1 } : item,
      ),
    );
  };

  const decrement = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity! > 1
          ? { ...item, quantity: item.quantity! - 1 }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className={scss.Order}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.header}>
            <h2 className={scss.title}>Корзина</h2>
            <button
              className={scss.button}
              onClick={() => handleDeleteAllOrder()}
            >
              {isPending ? "Удаление..." : "Очистить корзину"}
            </button>
          </div>

          {cartItems.length > 0 ? (
            <div className={scss.orderBox}>
              <div className={scss.box}>
                {cartItems.map((item) => (
                  <div key={item.id} className={scss.orderCard}>
                    <div className={scss.imageWrapper}>
                      <img
                        className={scss.image}
                        src={item.product.images[0]}
                        alt={item.product.title}
                      />
                    </div>

                    <div className={scss.cardInfo}>
                      <div className={scss.top}>
                        <h3 className={scss.name}>{item.product.title}</h3>
                        <div className={scss.price}>
                          {(
                            item.product.price * item.quantity!
                          ).toLocaleString()}{" "}
                          ₽
                        </div>
                      </div>

                      <div className={scss.props}>
                        {item.product.brandName && (
                          <div className={scss.prop}>
                            Бренд: <span>{item.product.brandName}</span>
                          </div>
                        )}
                      </div>

                      <div className={scss.actions}>
                        <div className={scss.counter}>
                          <button
                            className={scss.btn}
                            type="button"
                            onClick={() => decrement(item.id)}
                          >
                            −
                          </button>
                          <span className={scss.count}>{item.quantity}</span>
                          <button
                            className={scss.btn}
                            type="button"
                            onClick={() => increment(item.id)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className={scss.remove}
                          onClick={() => deleteItemById(item.product.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={scss.summary}>
                <div className={scss.total}>
                  Итого: <span>{total.toLocaleString()} ₽</span>
                </div>
                <CartBtn title="Оформить заказ" />
              </div>
            </div>
          ) : (
            <div className={scss.notFound}>
              <img src={NotFound?.src} alt="not found" />
              <h2>Корзина пуста</h2>
              <p>Добавьте товары в корзину</p>
              <button
                className={scss.btnNotFound}
                onClick={() => router.push("/")}
              >
                Перейти в главную
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Order;
