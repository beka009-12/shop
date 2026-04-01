"use client";
import { FC } from "react";
import scss from "./Favorite.module.scss";
import { useGetFavorites } from "@/api/favorite";
import { useGetMe } from "@/api/user";
import { useGetOrders } from "@/api/order";
import { useCartAddAction, useDelFavorite } from "@/hooks/useCartActions";
import { useRouter } from "next/navigation";

const Favorite: FC = () => {
  const router = useRouter();
  const { data: me } = useGetMe();
  const userId = me?.user?.id;

  const { data: favoriteData, isLoading } = useGetFavorites(userId!);
  const { data: orders } = useGetOrders(userId as number);
  const { addToCart } = useCartAddAction();
  const { handleRemove } = useDelFavorite();

  const favorites = favoriteData?.favorites ?? [];
  console.log(favorites);

  return (
    <section className={scss.favorite}>
      <div className="container">
        {/* Header */}
        <div className={scss.header}>
          <div className={scss.headerLeft}>
            <h1 className={scss.title}>Избранное</h1>
            {!isLoading && favorites.length > 0 && (
              <span className={scss.count}>{favorites.length} товара</span>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className={scss.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={scss.skeleton}>
                <div className={`${scss.skeletonImg} ${scss.shimmer}`} />
                <div className={scss.skeletonInfo}>
                  <div
                    className={`${scss.skeletonLine} ${scss.shimmer}`}
                    style={{ width: "70%" }}
                  />
                  <div
                    className={`${scss.skeletonLine} ${scss.shimmer}`}
                    style={{ width: "40%" }}
                  />
                  <div
                    className={`${scss.skeletonLine} ${scss.shimmer}`}
                    style={{ width: "55%", marginTop: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && favorites.length === 0 && (
          <div className={scss.empty}>
            <div className={scss.emptyIcon}>
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <h2 className={scss.emptyTitle}>Здесь пока пусто</h2>
            <p className={scss.emptySub}>
              Добавляйте товары в избранное, чтобы не потерять
            </p>
            <button
              className={scss.emptyBtn}
              onClick={() => router.push("/")}
              aria-label="Перейти в каталог"
            >
              Перейти в каталог
            </button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && favorites.length > 0 && (
          <div className={scss.grid}>
            {favorites.map((fav) => {
              const product = fav.product;
              const isInCart = orders?.some(
                (o: any) => o.product.id === product.id,
              );
              const discountPercent =
                product.newPrice && product.price > product.newPrice
                  ? Math.round(
                      ((product.price - product.newPrice) / product.price) *
                        100,
                    )
                  : 0;

              return (
                <div key={fav.productId} className={scss.card}>
                  {/* Image */}
                  <div
                    className={scss.imgWrap}
                    onClick={() => router.push(`/detail/${product.id}`)}
                  >
                    <img
                      src={product.images?.[0] || "/placeholder-product.jpg"}
                      alt={product.title}
                      className={scss.img}
                      loading="lazy"
                    />

                    {discountPercent > 0 && (
                      <span className={scss.badge}>−{discountPercent}%</span>
                    )}

                    <button
                      className={scss.favBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      aria-label="Убрать из избранного"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#E24B4A"
                        stroke="#E24B4A"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className={scss.info}>
                    <span
                      className={scss.name}
                      onClick={() => router.push(`/detail/${product.id}`)}
                    >
                      {product.title}
                    </span>

                    {product.brandName && (
                      <span className={scss.brand}>{product.brandName}</span>
                    )}

                    <div className={scss.priceRow}>
                      <span className={scss.price}>
                        {(product.newPrice || product.price).toLocaleString()}{" "}
                        сом
                      </span>
                      {product.newPrice && product.price > product.newPrice && (
                        <span className={scss.priceOld}>
                          {product.price.toLocaleString()} сом
                        </span>
                      )}
                    </div>

                    <button
                      className={`${scss.addBtn} ${isInCart ? scss.addBtnInCart : ""}`}
                      disabled={isInCart}
                      onClick={() => addToCart(product.id)}
                      aria-label={
                        isInCart ? "Добавлено в корзину" : "Добавить в корзину"
                      }
                    >
                      {isInCart ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          В корзине
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                          В корзину
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorite;
