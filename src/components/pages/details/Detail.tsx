"use client";
import { useState, type FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetProductById } from "@/api/product";
import scss from "./Detail.module.scss";
import Loader from "@/utils/loader/Loader";
import { useGetMe } from "@/api/user";
import { useGetOrders } from "@/api/order";
import { useCartAddAction } from "@/hooks/useCartActions";

const Detail: FC = () => {
  const { id } = useParams();
  const router = useRouter();

  // ? HOOKS
  const { addToCart } = useCartAddAction();
  // ? HOOKS

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { data: product, isPending } = useGetProductById(Number(id));
  const { data: me } = useGetMe();
  const { data: order } = useGetOrders(me?.user.id!);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  const isInCart = order?.some((item) => item.product.id === product.id);

  return (
    <section className={scss.detail}>
      <button onClick={() => router.back()} className={scss.btnBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={scss.backIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
        Назад
      </button>

      <div className={scss.container}>
        <div className={scss.gallery}>
          <div className={scss.thumbnails}>
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`${scss.thumb} ${
                  mainImage === img ? scss.activeThumb : ""
                }`}
              >
                <img
                  className={scss.thumbImage}
                  src={img}
                  alt={`Фото ${i + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <div className={scss.mainImageWrapper}>
            {hasDiscount && (
              <div className={scss.discountBadge}>-{discountPercent}%</div>
            )}
            <img
              src={mainImage}
              alt={product.title}
              className={scss.mainImage}
              loading="lazy"
            />
          </div>
        </div>
        <div className={scss.info}>
          <h1 className={scss.title}>{product.title}</h1>

          <div className={scss.priceBlock}>
            <div className={scss.priceWrapper}>
              <strong className={scss.currentPrice}>
                {Number(product.price).toLocaleString()} сом
              </strong>
              {hasDiscount && (
                <>
                  <span className={scss.oldPrice}>
                    {Number(product.oldPrice).toLocaleString()} сом
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Краткие характеристики в виде аккуратных строк */}
          <div className={scss.keyInfo}>
            {product.brandName && (
              <div className={scss.keyRow}>
                <span className={scss.keyLabel}>Бренд</span>
                <span className={scss.keyValue}>
                  {product.brandName || "Не указан"}
                </span>
              </div>
            )}

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Категория</span>
              <span className={scss.keyValue}>{product.category.name} </span>
            </div>

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Артикул</span>
              <span className={scss.keyValue}>{!Date.now() || "—"}</span>
            </div>

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Наличие</span>
              <span
                className={`${scss.keyValue} ${product.stockCount > 0 ? scss.inStock : scss.outOfStock}`}
              >
                {product.stockCount > 0
                  ? `${product.stockCount} шт`
                  : "Нет в наличии"}
              </span>
            </div>

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Добавлено</span>
              <span className={scss.keyValue}>
                {new Date(product.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Описание */}
          <div className={scss.description}>
            <h3>Описание товара</h3>
            <div className={scss.descContent}>
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className={scss.noDesc}>Описание отсутствует</p>
              )}
            </div>
          </div>

          {/* Информация о продавце — в карточке */}
          <div className={scss.description}>
            <h3>Информация магазина</h3>
            {product.store && (
              <div className={scss.sellerCard}>
                <div className={scss.header}>
                  {product.store.logo ? (
                    <img
                      className={scss.storeLogo}
                      src={product.store.logo!}
                      alt={product.store.name}
                    />
                  ) : (
                    ""
                  )}
                  <span className={scss.storeName}>
                    {!product.store.name || "Nest Shop"}
                  </span>
                </div>
                <div className={scss.sellerStats}>
                  {product.store.isVerified && (
                    <span className={scss.verified}>✓ Проверен</span>
                  )}
                  {product.store.rating && (
                    <span className={scss.rating}>
                      ★ {product.store.rating}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={scss.actions}>
            {isInCart ? (
              <button
                className={scss.addedBtn}
                onClick={() => router.push("/cart")}
              >
                Посмотреть в корзине
              </button>
            ) : (
              <button
                className={scss.addBtn}
                onClick={() => addToCart(product.id)}
              >
                Добавить в корзину
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
