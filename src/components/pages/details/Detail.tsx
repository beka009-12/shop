"use client";
import { useState, useEffect, type FC } from "react";
import { useParams } from "next/navigation";
import { useGetProductById } from "@/api/product";
import scss from "./Detail.module.scss";
import Loader from "@/utils/loader/Loader";
import { Btn, CartBtn } from "@/utils/ui/GlobalBtn/Btn";
import { useGetMe } from "@/api/user";
import { Package, Store, Tag, Calendar } from "lucide-react";
import { span } from "framer-motion/client";

const Detail: FC = () => {
  const { id } = useParams();

  const { data: product, isPending } = useGetProductById(Number(id));
  const { data: me } = useGetMe();

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!product || !me) return;
  }, [product, me]);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.oldPrice! - product.price) / product.oldPrice!) * 100,
      )
    : 0;

  // ... imports и начало компонента остаются без изменений

  return (
    <section className={scss.detail}>
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
                  <span className={scss.discountPercent}>
                    -{discountPercent}%
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
                <span className={scss.keyValue}>{product.brandName}</span>
              </div>
            )}

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Категория</span>
              <span className={scss.keyValue}>{product.category.name}</span>
            </div>

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Артикул</span>
              <span className={scss.keyValue}>{Date.now() || "—"}</span>
            </div>

            <div className={scss.keyRow}>
              <span className={scss.keyLabel}>Наличие</span>
              <span
                className={`${scss.keyValue} ${product.stockCount > 0 ? scss.inStock : scss.outOfStock}`}
              >
                {product.stockCount > 0
                  ? `В наличии: ${product.stockCount} шт`
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
          {product.store && (
            <div className={scss.sellerCard}>
              <div className={scss.sellerHeader}>
                <Store size={18} />
                <span>Магазин</span>
              </div>
              <div className={scss.sellerName}>
                <strong>Название магазина:</strong> {product.store.name || "Магазин"}
              </div>
              <div className={scss.sellerStats}>
                {product.store.isVerified && (
                  <span className={scss.verified}>✓ Проверен</span>
                )}
                {product.store.rating && (
                  <span className={scss.rating}>★ {product.store.rating}</span>
                )}
              </div>
            </div>
          )}

          {/* Кнопки — делаем крупнее и добавляем вторую опцию */}
          <div className={scss.actions}>
            <CartBtn title="Добавить в корзину" />
            {/* Можно добавить позже: */}
            {/* <Btn title="Купить сразу" variant="accent" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
