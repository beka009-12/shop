"use client";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import scss from "./Advertising.module.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { useGetBannerActive } from "@/api/generated/endpoints/banner/banner";
import { BannerItem, BannerProductEntry } from "@/api/generated/models";
import Image from "next/image";

const Advertising: FC = () => {
  const router = useRouter();
  const { data } = useGetBannerActive();
  const banners: BannerItem[] = data?.banners ?? [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const calcDiscount = (original: string, newPrice: string | null) => {
    const orig = original;
    const discounted = Number(newPrice);
    if (!orig || !discounted || discounted >= +orig) return null;
    return Math.round(((+orig - discounted) / +orig) * 100);
  };

  if (!banners.length) return null;

  return (
    <div className={scss.Advertising}>
      <div className="container">
        <div className={scss.swiperWrapper}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: `.${scss.navNext}`,
              prevEl: `.${scss.navPrev}`,
            }}
            loop={banners.length > 1}
            className={scss.swiper}
          >
            {banners.map((banner) => {
              const products: BannerProductEntry[] = banner.products ?? [];
              // API возвращает @maxItems 3, но на всякий случай
              const visibleProducts = products.slice(0, 3);
              // Количество оставшихся — приходит с бэка (может быть поле totalCount)
              // Пока считаем что API отдаёт максимум 3, остальное — в магазине
              const hasMore = products.length >= 3;

              return (
                <SwiperSlide key={banner.id}>
                  <div
                    className={`${scss.slide} ${scss[banner.color ?? "red"]}`}
                  >
                    <span className={scss.decoNum}>{banner.decoNum}</span>

                    {/* ── LEFT ── */}
                    <div className={scss.left}>
                      <div className={scss.storeRow}>
                        <div className={scss.storeAv}>
                          {banner.store?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={scss.storeNm}>
                          {banner.store?.name}
                        </span>
                        {banner.store?.isVerified && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="#378ADD"
                          >
                            <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        )}
                      </div>

                      <span className={scss.promoTag}>{banner.promoTag}</span>

                      <h2 className={scss.title}>
                        {banner.title} <em>{banner.accent}</em>
                      </h2>

                      <p className={scss.sub}>{banner.description}</p>

                      <div className={scss.deadlineRow}>
                        <span className={scss.dlLabel}>Акция до</span>
                        {banner.deadline && (
                          <span className={scss.dlVal}>
                            {formatDate(banner.deadline)}
                          </span>
                        )}
                      </div>

                      <button
                        className={scss.btn}
                        onClick={() => router.push(`/shops/${banner.storeId}`)}
                      >
                        Смотреть товары →
                      </button>
                    </div>

                    {/* ── RIGHT ── */}
                    <div className={scss.right}>
                      <span className={scss.rightLabel}>Товары по акции</span>

                      <div className={scss.prodList}>
                        {visibleProducts.map((entry, index) => {
                          const p = entry.product;
                          if (!p) return null;

                          const discount = calcDiscount(
                            entry.originalPrice ?? p.price ?? "0",
                            p.newPrice ?? null,
                          );
                          const displayPrice = p.newPrice
                            ? Number(p.newPrice)
                            : Number(p.price);
                          const img = p.images?.[0];

                          return (
                            <div
                              key={p.id ?? index}
                              className={scss.prodCard}
                              onClick={() => router.push(`/product/${p.id}`)}
                            >
                              <div className={scss.prodImg}>
                                {img ? (
                                  <Image
                                    src={img}
                                    alt={p.title!}
                                    width={70}
                                    height={70}
                                  />
                                ) : (
                                  <span>🛍️</span>
                                )}
                              </div>

                              <div className={scss.prodInfo}>
                                <div className={scss.prodName}>{p.title}</div>
                                <div className={scss.prodPrices}>
                                  <span className={scss.prodNew}>
                                    {displayPrice.toLocaleString("ru-RU")} сом
                                  </span>
                                  {p.newPrice && (
                                    <span className={scss.prodOld}>
                                      {Number(p.price).toLocaleString("ru-RU")}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {discount !== null && (
                                <span className={scss.prodBadge}>
                                  −{discount}%
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {hasMore && (
                        <button
                          className={scss.moreLink}
                          onClick={() =>
                            router.push(`/shops/${banner.storeId}`)
                          }
                        >
                          Смотреть все товары →
                        </button>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={scss.navControls}>
            <button className={scss.navPrev}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className={scss.navNext}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
