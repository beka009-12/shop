"use client";
import { useState, type FC } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useGetCommodityProductForUserId } from "@/api/generated/endpoints/product/product";

const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
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

function isShoeProduct(title?: string, category?: string): boolean {
  const text = `${title ?? ""} ${category ?? ""}`.toLowerCase();
  return SHOE_KEYWORDS.some((kw) => text.includes(kw));
}

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Detail: FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const { addToCart } = useCartAddAction();
  const { addToFavorite } = useFavoriteFun();
  const { handleRemove } = useDelFavorite();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // data shape: GetCommodityProductForUserId200 = { product?: Product }
  const { data, isPending } = useGetCommodityProductForUserId(Number(id));
  const product = data?.product;

  const { data: me } = useGetMe();
  const { data: orders } = useGetOrders(me?.user.id!);
  const { data: favorite } = useGetFavorites(me?.user.id!);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  // Safe accessors with fallbacks
  const price = product.price ?? 0;
  const newPrice = product.newPrice ?? null;
  const stockCount = product.stockCount ?? 0;
  const soldCount = product.soldCount ?? 0;
  const mainImage = activeImage ?? product.images?.[0];

  const discountPercent =
    newPrice != null && price > newPrice
      ? Math.round(((price - newPrice) / price) * 100)
      : 0;

  const isInCart = orders?.some((item: any) => item.product.id === product.id);
  const isFavorite = favorite?.favorites?.some(
    (item: any) => item.product.id === product.id,
  );

  const isShoe = isShoeProduct(product.title, product.category?.name);
  const sizes = isShoe ? SHOE_SIZES : CLOTHING_SIZES;

  const rating = product.store?.rating ?? 4.8;
  const reviewCount = 206;

  const onFavoriteClick = () => {
    if (!product.id) return;
    isFavorite ? handleRemove(product.id) : addToFavorite(product.id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      document
        .getElementById("size-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSizeError(false);
    if (product.id) addToCart(product.id);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  return (
    <section className={scss.detail}>
      {/* ── Back bar ── */}
      <div className={scss.topBar}>
        <button
          onClick={() => router.back()}
          className={scss.btnBack}
          aria-label="Назад"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

      <div className={scss.container}>
        {/* ── Gallery ── */}
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
            {stockCount > 0 && stockCount <= 5 && (
              <span className={scss.urgencyBadge}>
                Осталось {stockCount} шт
              </span>
            )}
            <img
              src={mainImage}
              alt={product.title}
              className={scss.mainImage}
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Info ── */}
        <div className={scss.info}>
          {/* Store header */}
          <div className={scss.storeHeader}>
            {product.store?.logo ? (
              <img
                src={product.store.logo}
                alt={product.store.name}
                className={scss.storeAvatar}
              />
            ) : (
              <div className={scss.storeAvatarFallback}>
                {(product.store?.name ?? "NS").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className={scss.storeHeaderInfo}>
              <span className={scss.storeName}>
                {product.store?.name ?? "Nest Shop"}
              </span>
              {product.store?.rating && (
                <span className={scss.storeRating}>
                  ★ {product.store.rating}
                  {product.store.isVerified && (
                    <span className={scss.verifiedDot} title="Проверен">
                      ✓
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className={scss.storeActions}>
              <button
                className={scss.iconBtn}
                onClick={onFavoriteClick}
                title={isFavorite ? "Убрать из избранного" : "В избранное"}
              >
                <HeartIcon filled={!!isFavorite} />
              </button>
              <button className={scss.iconBtn} title="Поделиться">
                <ShareIcon />
              </button>
            </div>
          </div>

          {/* Title & rating */}
          <div className={scss.titleBlock}>
            {product.brandName && (
              <span className={scss.brandTag}>{product.brandName}</span>
            )}
            <h1 className={scss.title}>{product.title}</h1>
            <div className={scss.ratingRow}>
              <div className={scss.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={rating >= s ? scss.starFilled : scss.starEmpty}
                  >
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className={scss.ratingCount}>{reviewCount} отзывов</span>
              {soldCount > 0 && (
                <span className={scss.soldBadge}>{soldCount}+ куплено</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className={scss.priceRow}>
            <span className={scss.priceMain}>
              {Number(newPrice ?? price).toLocaleString()} сом
            </span>
            {newPrice != null && price > newPrice && (
              <span className={scss.priceOld}>
                {Number(price).toLocaleString()} сом
              </span>
            )}
          </div>

          <div className={scss.divider} />

          {/* Colors */}
          {(product.colors?.length ?? 0) > 0 && (
            <div className={scss.colorSection}>
              <span className={scss.sectionLabel}>
                Цвет <strong>{product.colors![0]}</strong>
              </span>
              <div className={scss.colorDots}>
                {product.colors!.map((color, i) => (
                  <button
                    key={i}
                    className={`${scss.colorDot} ${scss.colorDotActive}`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className={scss.sizeSection} id="size-section">
            <div className={scss.sizeHead}>
              <span className={scss.sectionLabel}>
                Размер {selectedSize && <strong>{selectedSize}</strong>}
              </span>
              <button className={scss.sizeGuide} type="button">
                Таблица размеров
              </button>
            </div>

            <div className={scss.sizeGrid}>
              {sizes.map((size) => {
                const available = product.sizes?.includes(size) ?? false;
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => available && handleSizeSelect(size)}
                    className={[
                      scss.sizeBtn,
                      isActive ? scss.sizeBtnActive : "",
                      !available ? scss.sizeBtnUnavailable : "",
                    ].join(" ")}
                    disabled={!available}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <p className={scss.sizeError}>Пожалуйста, выберите размер</p>
            )}
          </div>

          {/* Quantity */}
          <div className={scss.quantitySection}>
            <span className={scss.sectionLabel}>Количество</span>
            <div className={scss.quantityControl}>
              <button
                className={scss.qtyBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className={scss.qtyValue}>{quantity}</span>
              <button
                className={scss.qtyBtn}
                onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                disabled={quantity >= stockCount}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className={scss.actions}>
            {isInCart ? (
              <button
                className={`${scss.btnPrimary} ${scss.btnInCart}`}
                onClick={() => router.push("/cart")}
              >
                <CheckIcon />
                Посмотреть в корзине
              </button>
            ) : (
              <button className={scss.btnPrimary} onClick={handleAddToCart}>
                Добавить в корзину
              </button>
            )}
            <button className={scss.btnSecondary}>Купить сейчас</button>
          </div>

          {/* Stock row */}
          <div className={scss.stockRow}>
            <span className={stockCount > 0 ? scss.inStock : scss.outOfStock}>
              {stockCount > 0
                ? `● В наличии · ${stockCount} шт`
                : "● Нет в наличии"}
            </span>
            {product.createdAt && (
              <span className={scss.addedDate}>
                Добавлен{" "}
                {new Date(product.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: description + tags ── */}
      {(product.description || (product as any).tags?.length > 0) && (
        <div className={scss.bottomSection}>
          {product.description && (
            <div className={scss.descBlock}>
              <p className={scss.descHead}>Описание</p>
              <p className={scss.descText}>{product.description}</p>
            </div>
          )}
          {(product as any).tags?.length > 0 && (
            <div className={scss.tagsBlock}>
              <p className={scss.descHead}>Теги</p>
              <div className={scss.tags}>
                {((product as any).tags as string[]).map((tag, i) => (
                  <span key={i} className={scss.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Detail;
