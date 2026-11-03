"use client";
import { useState, type FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "swiper/css";
import "swiper/css/pagination";
import scss from "./Detail.module.scss";
import DetailSceleton from "@/utils/ui/sceletons/DetailSceleton";
import { useGetCart } from "@/api/generated/endpoints/cart/cart";
import {
  useCartAddAction,
  useDelFavorite,
  useFavoriteFun,
} from "@/hooks/useCartActions";
import { useGetFavoriteFavorites } from "@/api/generated/endpoints/favorite/favorite";
import { useGetCommodityProductUserId } from "@/api/generated/endpoints/product/product";
import { getDiscountPercent } from "@/utils/price";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>
);
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ImageOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="48" height="48">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

// ─── Motion config ────────────────────────────────────────────────────────────
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const easeSharp: [number, number, number, number] = [0.4, 0, 0.2, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease, delay },
});

const Detail: FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const reduce = useReducedMotion();

  const { addToCart }    = useCartAddAction();
  const { addToFavorite } = useFavoriteFun();
  const { handleRemove } = useDelFavorite();

  const [activeImage, setActiveImage]   = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sizeError, setSizeError]         = useState(false);
  const [quantity, setQuantity]           = useState(1);

  const { data, isPending } = useGetCommodityProductUserId(Number(id));
  const product = data?.product;
  const { data: cartData }  = useGetCart();
  const { data: favorite }  = useGetFavoriteFavorites();

  if (isPending) return <DetailSceleton />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const price       = product.price ?? 0;
  const newPrice    = product.newPrice ?? null;
  const stockCount  = product.stockCount ?? 0;
  const soldCount   = product.soldCount ?? 0;
  const imgs        = (product.productImages?.map((img) => img.url).filter(Boolean) as string[]) ?? [];
  const mainImg     = activeImage ?? imgs[0];
  const displayPrice  = Number(newPrice ?? price).toLocaleString("ru-RU");
  const discountPct   = getDiscountPercent(price, newPrice);
  const isInCart  = cartData?.items?.some((i) => i.product?.id === product.id);
  const isFav     = favorite?.favorites?.some((i: any) => i.product.id === product.id);
  const sizes      = product.sizes ?? [];
  const activeColor = selectedColor ?? product.colors?.[0] ?? null;
  const rating      = product.store?.rating;
  const reviewCount = (product as any)._count?.reviews as number | undefined;

  const onFavClick = () => {
    if (!product.id) return;
    isFav ? handleRemove(product.id) : addToFavorite(product.id);
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    if (product.id) addToCart(product.id);
  };

  return (
    <section className={scss.page}>

      {/* ── Back ────────────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => router.back()}
        className={scss.btnBack}
        whileHover={reduce ? {} : { x: -2 }}
        whileTap={reduce ? {} : { scale: 0.96 }}
        transition={{ duration: 0.15 }}
      >
        <ArrowLeftIcon />
        <span className={scss.btnBackLabel}>Назад</span>
      </motion.button>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className={scss.layout}>

        {/* Gallery column */}
        <motion.div
          className={scss.galleryCol}
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {/* MOBILE: Swiper */}
          <div className={scss.mobileGallery}>
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={1} spaceBetween={0} className={scss.swiper}>
              {imgs.length > 0
                ? imgs.map((img, i) => (
                    <SwiperSlide key={i} className={scss.slide}>
                      <img src={img} alt={`${product.title} фото ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
                    </SwiperSlide>
                  ))
                : (
                    <SwiperSlide className={`${scss.slide} ${scss.slidePlaceholder}`}>
                      <ImageOffIcon />
                    </SwiperSlide>
                  )}
            </Swiper>
            {discountPct > 0 && <span className={scss.photoBadgeDiscount}>−{discountPct}%</span>}
            {stockCount > 0 && stockCount <= 5 && <span className={scss.photoBadgeUrgency}>Осталось {stockCount} шт</span>}
            <div className={scss.photoGradient} />
          </div>

          {/* DESKTOP: thumbnails + main image */}
          <div className={scss.desktopGallery}>
            {imgs.length > 1 && (
              <div className={scss.thumbCol}>
                {imgs.map((img, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`${scss.thumb} ${mainImg === img ? scss.thumbActive : ""}`}
                    whileHover={reduce ? {} : { scale: 1.04 }}
                    whileTap={reduce ? {} : { scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <img src={img} alt={`Фото ${i + 1}`} loading="lazy" />
                  </motion.button>
                ))}
              </div>
            )}

            <div className={scss.mainImgBox}>
              {discountPct > 0 && <span className={scss.photoBadgeDiscount}>−{discountPct}%</span>}
              {stockCount > 0 && stockCount <= 5 && <span className={scss.photoBadgeUrgency}>Осталось {stockCount} шт</span>}

              {/* Crossfade on image switch */}
              <AnimatePresence mode="wait" initial={false}>
                {mainImg ? (
                  <motion.img
                    key={mainImg}
                    src={mainImg}
                    alt={product.title ?? ""}
                    className={scss.mainImg}
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28, ease }}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    className={scss.imgPlaceholder}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ImageOffIcon />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div
          className={scss.infoCard}
          initial={reduce ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.05 }}
        >
          <div className={scss.pullHandle} />

          {/* Store row */}
          <motion.div className={scss.storeRow} {...(reduce ? {} : fadeUp(0.08))}>
            {product.store?.logo ? (
              <img src={product.store.logo} alt={product.store.name} className={scss.storeAvatar} />
            ) : (
              <div className={scss.storeAvatarFallback}>
                {(product.store?.name ?? "NS").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className={scss.storeMeta}>
              <span className={scss.storeName}>{product.store?.name ?? "Nest Shop"}</span>
              {rating != null && (
                <span className={scss.storeRating}>
                  ★ {rating}{product.store?.isVerified ? " · Верифицирован ✓" : ""}
                </span>
              )}
            </div>
            <div className={scss.storeActions}>
              <motion.button
                className={`${scss.actionBtn} ${isFav ? scss.actionBtnFav : ""}`}
                onClick={onFavClick}
                title={isFav ? "Убрать из избранного" : "В избранное"}
                whileHover={reduce ? {} : { scale: 1.08 }}
                whileTap={reduce ? {} : { scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <HeartIcon filled={!!isFav} />
              </motion.button>
              <motion.button
                className={scss.actionBtn}
                title="Поделиться"
                whileHover={reduce ? {} : { scale: 1.08 }}
                whileTap={reduce ? {} : { scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <ShareIcon />
              </motion.button>
            </div>
          </motion.div>

          {/* Title block */}
          <motion.div className={scss.titleBlock} {...(reduce ? {} : fadeUp(0.14))}>
            {product.brandName && <span className={scss.brandPill}>{product.brandName}</span>}
            <h1 className={scss.title}>{product.title}</h1>
            {(rating != null || (reviewCount != null && reviewCount > 0) || soldCount > 0) && (
              <div className={scss.ratingRow}>
                {rating != null && (
                  <span className={scss.stars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={rating >= s ? scss.starOn : scss.starOff}>
                        <StarIcon />
                      </span>
                    ))}
                  </span>
                )}
                {reviewCount != null && reviewCount > 0 && (
                  <span className={scss.reviewLink}>{reviewCount} отзывов</span>
                )}
                {soldCount > 0 && <span className={scss.soldChip}>{soldCount}+ куплено</span>}
              </div>
            )}
          </motion.div>

          {/* Price */}
          <motion.div className={scss.priceBlock} {...(reduce ? {} : fadeUp(0.18))}>
            <div className={scss.priceRow}>
              <span className={scss.price}>
                {displayPrice} <span className={scss.priceCurrency}>сом</span>
              </span>
              {discountPct > 0 && <span className={scss.discountChip}>−{discountPct}%</span>}
            </div>
            {discountPct > 0 && (
              <span className={scss.priceOld}>{Number(price).toLocaleString("ru-RU")} сом</span>
            )}
          </motion.div>

          {stockCount > 0 && stockCount <= 5 && (
            <motion.p className={scss.urgencyNote} {...(reduce ? {} : fadeUp(0.2))}>
              🔥 Осталось всего {stockCount} шт
            </motion.p>
          )}

          <div className={scss.sep} />

          {/* Colors */}
          {(product.colors?.length ?? 0) > 0 && (
            <motion.div className={scss.colorBlock} {...(reduce ? {} : fadeUp(0.22))}>
              <p className={scss.fieldLabel}>Цвет <strong>{activeColor}</strong></p>
              <div className={scss.colorRow}>
                {product.colors!.map((c, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    className={`${scss.colorDot} ${activeColor === c ? scss.colorDotActive : ""}`}
                    style={{ background: c }}
                    title={c}
                    onClick={() => setSelectedColor(c)}
                    whileHover={reduce ? {} : { scale: 1.15 }}
                    whileTap={reduce ? {} : { scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <motion.div className={scss.sizeBlock} {...(reduce ? {} : fadeUp(0.26))}>
              <div className={scss.sizeHead}>
                <p className={scss.fieldLabel}>
                  Размер {selectedSize && <strong>{selectedSize}</strong>}
                </p>
                <button className={scss.sizeGuide} type="button">Таблица размеров</button>
              </div>
              <div className={scss.sizeGrid}>
                {sizes.map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`${scss.sizeChip} ${selectedSize === s ? scss.sizeChipOn : ""}`}
                    whileHover={reduce ? {} : { scale: 1.05 }}
                    whileTap={reduce ? {} : { scale: 0.94 }}
                    transition={{ duration: 0.12 }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              {sizeError && <p className={scss.sizeErr}>Выберите размер</p>}
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div className={scss.qtyRow} {...(reduce ? {} : fadeUp(0.30))}>
            <p className={scss.fieldLabel}>Количество</p>
            <div className={scss.qtyControl}>
              <motion.button
                className={scss.qtyBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                whileTap={reduce ? {} : { scale: 0.88 }}
                transition={{ duration: 0.1 }}
              >
                −
              </motion.button>
              <span className={scss.qtyVal}>{quantity}</span>
              <motion.button
                className={scss.qtyBtn}
                onClick={() => setQuantity(Math.min(stockCount || 99, quantity + 1))}
                disabled={stockCount > 0 && quantity >= stockCount}
                whileTap={reduce ? {} : { scale: 0.88 }}
                transition={{ duration: 0.1 }}
              >
                +
              </motion.button>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div className={scss.ctaGroup} {...(reduce ? {} : fadeUp(0.34))}>
            {isInCart ? (
              <motion.button
                className={`${scss.btnPrimary} ${scss.btnGreen}`}
                onClick={() => router.push("/cart")}
                whileHover={reduce ? {} : { scale: 1.01, boxShadow: "0 8px 24px rgba(39,174,96,0.35)" }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: easeSharp }}
              >
                <CheckIcon /> Посмотреть в корзине
              </motion.button>
            ) : (
              <motion.button
                className={scss.btnPrimary}
                onClick={handleAddToCart}
                whileHover={reduce ? {} : { scale: 1.01, boxShadow: "0 8px 28px rgba(85,51,235,0.38)" }}
                whileTap={reduce ? {} : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: easeSharp }}
              >
                Добавить в корзину
              </motion.button>
            )}
            <motion.button
              className={scss.btnOutline}
              whileHover={reduce ? {} : { scale: 1.01 }}
              whileTap={reduce ? {} : { scale: 0.98 }}
              transition={{ duration: 0.18, ease: easeSharp }}
            >
              Купить сейчас
            </motion.button>
          </motion.div>

          {/* Stock */}
          <motion.div className={scss.stockRow} {...(reduce ? {} : fadeUp(0.36))}>
            <span className={stockCount > 0 ? scss.inStock : scss.noStock}>
              {stockCount > 0 ? `● В наличии · ${stockCount} шт` : "● Нет в наличии"}
            </span>
            {product.createdAt && (
              <span className={scss.addedDate}>
                {new Date(product.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Description + Tags ──────────────────────────────────────────── */}
      {(product.description || (product as any).tags?.length > 0) && (
        <motion.div
          className={scss.bottomSection}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease }}
        >
          {product.description && (
            <div className={scss.bottomCard}>
              <p className={scss.bottomCardLabel}>ОПИСАНИЕ</p>
              <p className={scss.descText}>{product.description}</p>
            </div>
          )}
          {(product as any).tags?.length > 0 && (
            <div className={scss.bottomCard}>
              <p className={scss.bottomCardLabel}>ТЕГИ</p>
              <div className={scss.tagList}>
                {((product as any).tags as string[]).map((t, i) => (
                  <motion.span
                    key={i}
                    className={scss.tag}
                    whileHover={reduce ? {} : { scale: 1.04 }}
                    whileTap={reduce ? {} : { scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Sticky bar (mobile) ─────────────────────────────────────────── */}
      <div className={scss.stickyBar}>
        <div className={scss.stickyInner}>
          <div className={scss.stickyPrices}>
            <span className={scss.stickyPrice}>{displayPrice} сом</span>
            {discountPct > 0 && (
              <span className={scss.stickyOld}>{Number(price).toLocaleString("ru-RU")}</span>
            )}
          </div>
          {isInCart ? (
            <motion.button
              className={`${scss.stickyBtn} ${scss.stickyBtnGreen}`}
              onClick={() => router.push("/cart")}
              whileTap={reduce ? {} : { scale: 0.96 }}
              transition={{ duration: 0.12 }}
            >
              В корзине →
            </motion.button>
          ) : (
            <motion.button
              className={scss.stickyBtn}
              onClick={handleAddToCart}
              whileTap={reduce ? {} : { scale: 0.96 }}
              transition={{ duration: 0.12 }}
            >
              В корзину
            </motion.button>
          )}
        </div>
      </div>

    </section>
  );
};

export default Detail;
