"use client";
import React, { type FC, useState, useEffect, useRef } from "react";
import scss from "./Order.module.scss";
import { useDeleteById, useGetOrders } from "@/api/order";
import { useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCartDeleteAction } from "@/hooks/useCartActions";
import CheckoutModal from "./CheckoutModal";
import OrderSkeleton from "@/utils/ui/sceletons/OrderSceleton";
import OrderNot from "@/utils/ui/noteF/OrderNot";
import Image from "next/image";

const Order: FC = () => {
  const router = useRouter();
  const { data: user } = useGetMe();
  const userId = user?.user?.id;

  const { data: cartData, isLoading } = useGetOrders(Number(userId));
  const { mutateAsync: deleteByIdAsync } = useDeleteById();
  const { deleteAllFromCart } = useCartDeleteAction();

  const [cartItems, setCartItems] = useState(cartData || []);
  const [openModal, setOpenModal] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartData) setCartItems(cartData);
  }, [cartData]);

  useEffect(() => {
    const check = () => {
      if (!summaryRef.current) return;
      const rect = summaryRef.current.getBoundingClientRect();
      const hidden = rect.bottom < 0 || rect.top > window.innerHeight;
      setShowFloating(hidden && window.innerWidth <= 1024);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [cartItems.length]);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + Number(item?.product?.price || 0) * (item?.quantity || 1);
  }, 0);

  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const deleteItemById = async (productId: number) => {
    try {
      await deleteByIdAsync({ productId });
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
      toast.success("Товар удалён");
    } catch {
      toast.error("Не удалось удалить товар");
    }
  };

  const increment = (id: number) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i,
      ),
    );

  const decrement = (id: number) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && (i.quantity || 1) > 1
          ? { ...i, quantity: (i.quantity || 1) - 1 }
          : i,
      ),
    );

  const handlePromo = () => {
    if (!promoCode.trim()) return;
    setPromoApplied(true);
    toast.success("Промокод применён — скидка 10%");
  };

  const size = {
    1: "S",
    2: "M",
    3: "L",
    4: "XL",
    5: "XXL",
  };

  if (isLoading) return <OrderSkeleton count={3} />;

  return (
    <>
      <section className={scss.order}>
        <div className="container">
          {/* Header */}
          <div className={scss.header}>
            <div className={scss.headerLeft}>
              <h2 className={scss.title}>Корзина</h2>
              {cartItems.length > 0 && (
                <span className={scss.count}>{cartItems.length} товара</span>
              )}
            </div>
            {cartItems.length > 0 && (
              <button className={scss.clearBtn} onClick={deleteAllFromCart}>
                Очистить всё
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <OrderNot />
          ) : (
            <div className={scss.grid}>
              <div className={scss.items}>
                {cartItems.map((item) => {
                  const itemTotal =
                    Number(item.product?.price || 0) * (item.quantity || 1);

                  return (
                    <div key={item.id} className={scss.card}>
                      <div
                        className={scss.imgWrap}
                        onClick={() =>
                          router.push(`/detail/${item.product.id}`)
                        }
                      >
                        <Image
                          src={
                            item.product?.images?.[0] ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.product?.title || "Товар"}
                          className={scss.img}
                          width={150}
                          height={150}
                        />
                      </div>

                      <div className={scss.cardBody}>
                        <div className={scss.cardTop}>
                          <div className={scss.cardMeta}>
                            <h3
                              className={scss.cardName}
                              onClick={() =>
                                router.push(`/detail/${item.product.id}`)
                              }
                            >
                              {item.product?.title || "—"}
                            </h3>
                            {item.product?.brandName && (
                              <span className={scss.cardBrand}>
                                {item.product.brandName}
                              </span>
                            )}
                            {size && (
                              <span className={scss.cardSize}>
                                Размер: {size[1]}
                              </span>
                            )}
                          </div>
                          <div className={scss.cardPrices}>
                            <span className={scss.cardPrice}>
                              {itemTotal.toLocaleString()} сом
                            </span>
                            {(item.quantity || 1) > 1 && (
                              <span className={scss.cardUnit}>
                                {Number(
                                  item.product?.price || 0,
                                ).toLocaleString()}{" "}
                                × {item.quantity}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={scss.cardFoot}>
                          <div className={scss.counter}>
                            <button
                              className={scss.cBtn}
                              onClick={() => decrement(item.id)}
                              disabled={(item.quantity || 1) <= 1}
                              aria-label="Уменьшить"
                            >
                              −
                            </button>
                            <span className={scss.cVal}>
                              {item.quantity || 1}
                            </span>
                            <button
                              className={scss.cBtn}
                              onClick={() => increment(item.id)}
                              aria-label="Увеличить"
                            >
                              +
                            </button>
                          </div>

                          <button
                            className={scss.delBtn}
                            onClick={() => deleteItemById(item.product.id)}
                            aria-label="Удалить"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.8}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={scss.summary} ref={summaryRef}>
                <div className={scss.sumRow}>
                  <span className={scss.sumLabel}>
                    Товары ({cartItems.length})
                  </span>
                  <span className={scss.sumVal}>
                    {subtotal.toLocaleString()} сом
                  </span>
                </div>
                <div className={scss.sumRow}>
                  <span className={scss.sumLabel}>Доставка</span>
                  <span className={scss.free}>Бесплатно</span>
                </div>
                {promoApplied && (
                  <div className={scss.sumRow}>
                    <span className={scss.sumLabel}>Скидка (10%)</span>
                    <span className={scss.discount}>
                      −{discount.toLocaleString()} сом
                    </span>
                  </div>
                )}

                <div className={scss.promoRow}>
                  {promoApplied ? (
                    <div className={scss.promoSuccess}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Промокод применён
                    </div>
                  ) : (
                    <>
                      <input
                        className={scss.promoInput}
                        placeholder="Промокод"
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                      />
                      <button className={scss.promoApply} onClick={handlePromo}>
                        Применить
                      </button>
                    </>
                  )}
                </div>

                <div className={scss.sumDivider} />

                <div className={scss.sumTotal}>
                  <span className={scss.sumTotalLabel}>Итого</span>
                  <span className={scss.sumTotalVal}>
                    {total.toLocaleString()} сом
                  </span>
                </div>

                <button
                  className={scss.checkoutBtn}
                  onClick={() => setOpenModal(true)}
                >
                  Оформить заказ
                </button>

                <p className={scss.safeNote}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                  Безопасная оплата
                </p>
              </div>
            </div>
          )}
        </div>

        {showFloating && cartItems.length > 0 && (
          <div className={scss.floating}>
            <div className={scss.floatingInner}>
              <div>
                <p className={scss.floatingLabel}>Итого</p>
                <p className={scss.floatingVal}>{total.toLocaleString()} сом</p>
              </div>
              <button
                className={scss.floatingBtn}
                onClick={() => setOpenModal(true)}
              >
                Оформить
              </button>
            </div>
          </div>
        )}
      </section>

      <CheckoutModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default Order;
