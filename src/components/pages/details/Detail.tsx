"use client";
import { useState, type FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetProductById } from "@/api/product";
import scss from "./Detail.module.scss";
import Loader from "@/utils/loader/Loader";
import { useGetMe } from "@/api/user";
import { useGetOrders } from "@/api/order";
import {
  useCartAddAction,
  useDelFavorite,
  useFavoriteFun,
} from "@/hooks/useCartActions";
import { useGetFavorites } from "@/api/favorite";

// ─── Размеры ─────────────────────────────────────────────────
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

const SHOE_KEYWORDS = [
  "кроссовк",
  "ботинк",
  "туфл",
  "сапог",
  "кед",
  "мокасин",
  "сандал",
  "тапочк",
  "слипон",
  "sneaker",
  "shoe",
  "boot",
];

function isShoeProduct(title: string, category?: string): boolean {
  const text = `${title} ${category || ""}`.toLowerCase();
  return SHOE_KEYWORDS.some((kw) => text.includes(kw));
}

const Detail: FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const { addToCart } = useCartAddAction();
  const { addToFavorite } = useFavoriteFun();
  const { handleRemove } = useDelFavorite();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const { data: product, isPending } = useGetProductById(Number(id));
  const { data: me } = useGetMe();
  const { data: orders } = useGetOrders(me?.user.id!);
  const { data: favorite } = useGetFavorites(me?.user.id!);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];

  const discountPercent =
    product.newPrice && product.price > product.newPrice
      ? Math.round(((product.price - product.newPrice) / product.price) * 100)
      : 0;

  const isInCart = orders?.some((item: any) => item.product.id === product.id);
  const isFavorite = favorite?.favorites?.some(
    (item: any) => item.product.id === product.id,
  );

  const isShoe = isShoeProduct(product.title, product.category?.name);
  const sizes = isShoe ? SHOE_SIZES : CLOTHING_SIZES;

  const onFavoriteClick = () => {
    isFavorite ? handleRemove(product.id) : addToFavorite(product.id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      document.getElementById("size-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setSizeError(false);
    addToCart(product.id);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  return (
    <section className={scss.detail}>
      <div className={scss.topBar}>
        <button
          onClick={() => router.back()}
          className={scss.btnBack}
          aria-label="Назад"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Назад
        </button>
      </div>

      {/* ── Верхняя сетка ── */}
      <div className={scss.container}>
        {/* Gallery */}
        <div className={scss.gallery}>
          <div className={scss.thumbnails}>
            {product.images?.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveImage(img)}
                className={`${scss.thumb} ${mainImage === img ? scss.activeThumb : ""}`}
              >
                <img src={img} alt={`Фото ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className={scss.mainImageWrapper}>
            {discountPercent > 0 && (
              <span className={scss.discountBadge}>−{discountPercent}%</span>
            )}
            <img
              src={mainImage}
              alt={product.title}
              className={scss.mainImage}
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className={scss.info}>
          <div className={scss.titleBlock}>
            {product.brandName && (
              <span className={scss.brandTag}>{product.brandName}</span>
            )}
            <h1 className={scss.title}>{product.title}</h1>
          </div>

          {product.tags?.length > 0 && (
            <div className={scss.tags}>
              {product.tags.map((tag: string, i: number) => (
                <span key={i} className={scss.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={scss.priceRow}>
            <span className={scss.priceMain}>
              {Number(product.newPrice || product.price).toLocaleString()} сом
            </span>
            {product.newPrice && product.price > product.newPrice && (
              <span className={scss.priceOld}>
                {Number(product.price).toLocaleString()} сом
              </span>
            )}
          </div>

          <div className={scss.divider} />

          <div className={scss.attrs}>
            {product.brandName && (
              <div className={scss.attrRow}>
                <span className={scss.attrLabel}>Бренд</span>
                <span className={scss.attrVal}>{product.brandName}</span>
              </div>
            )}
            <div className={scss.attrRow}>
              <span className={scss.attrLabel}>Наличие</span>
              <span
                className={`${scss.attrVal} ${product.stockCount > 0 ? scss.inStock : scss.outOfStock}`}
              >
                {product.stockCount > 0
                  ? `${product.stockCount} шт`
                  : "Нет в наличии"}
              </span>
            </div>
            <div className={scss.attrRow}>
              <span className={scss.attrLabel}>Добавлено</span>
              <span className={scss.attrVal}>
                {new Date(product.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* ── Size selector ── */}
          <div className={scss.sizeSection} id="size-section">
            <div className={scss.sizeHead}>
              <span className={scss.sizeLabel}>
                {selectedSize
                  ? `Размер: ${selectedSize}`
                  : isShoe
                    ? "Выберите размер обуви"
                    : "Выберите размер"}
              </span>
              <button className={scss.sizeGuide} type="button">
                Таблица размеров
              </button>
            </div>

            <div className={scss.sizeGrid}>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`${scss.sizeBtn} ${selectedSize === size ? scss.sizeBtnActive : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>

            {sizeError && (
              <p className={scss.sizeError}>
                Пожалуйста, выберите размер перед добавлением в корзину
              </p>
            )}
          </div>

          {/* Actions */}
          <div className={scss.actions}>
            {isInCart ? (
              <button
                className={`${scss.btnCart} ${scss.btnInCart}`}
                onClick={() => router.push("/cart")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Посмотреть в корзине
              </button>
            ) : (
              <button className={scss.btnCart} onClick={handleAddToCart}>
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
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                Добавить в корзину
              </button>
            )}

            <button
              className={`${scss.btnFav} ${isFavorite ? scss.btnFavActive : ""}`}
              onClick={onFavoriteClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                fill={isFavorite ? "#E24B4A" : "none"}
                stroke={isFavorite ? "#E24B4A" : "currentColor"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              {isFavorite ? "В избранном" : "В избранное"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Нижняя секция: описание + магазин ── */}
      {(product.description || product.store) && (
        <div className={scss.bottomSection}>
          {product.description && (
            <div className={scss.descBlock}>
              <p className={scss.descHead}>Описание</p>
              <p className={scss.descText}>{product.description}</p>
            </div>
          )}

          {product.store && (
            <div className={scss.storeBlock}>
              <div className={scss.storeLeft}>
                {product.store.logo ? (
                  <img
                    className={scss.storeLogo}
                    src={product.store.logo}
                    alt={product.store.name}
                  />
                ) : (
                  <div className={scss.storeLogoFallback}>
                    {(product.store.name || "NS").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className={scss.storeName}>
                    {product.store.name || "Nest Shop"}
                  </p>
                  {product.store.rating && (
                    <p className={scss.storeMeta}>★ {product.store.rating}</p>
                  )}
                </div>
              </div>
              {product.store.isVerified && (
                <span className={scss.verified}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Проверен
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Detail;
