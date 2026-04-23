"use client";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import scss from "./Advertising.module.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

const BANNERS = [
  {
    id: 1,
    store: "Nike Official Store",
    storeCode: "NK",
    verified: true,
    promoTag: "Сезонная распродажа",
    title: "Скидка",
    accent: "−50% на всю обувь Nike",
    sub: "Лучшие цены сезона на кроссовки, кеды и сандалии. Успей купить до конца акции.",
    deadline: "30 апреля 2026",
    decoNum: "−50%",
    color: "red",
    storeId: 1,
    products: [
      {
        name: "Nike Air Max Plus",
        newPrice: "9 825",
        oldPrice: "19 650",
        badge: "−50%",
        emoji: "👟",
      },
      {
        name: "Nike React Vision",
        newPrice: "7 450",
        oldPrice: "14 900",
        badge: "−50%",
        emoji: "👟",
      },
      {
        name: "Nike Free Run 5.0",
        newPrice: "6 200",
        oldPrice: "12 400",
        badge: "−50%",
        emoji: "👟",
      },
    ],
    moreCount: 24,
  },
  {
    id: 2,
    store: "SportFashion KG",
    storeCode: "SF",
    verified: true,
    promoTag: "Специальное предложение",
    title: "Купи 1 —",
    accent: "получи 2-й в подарок",
    sub: "При покупке любой вещи из коллекции — вторая такая же бесплатно. Без ограничений по сумме.",
    deadline: "25 апреля 2026",
    decoNum: "1+1=3",
    color: "green",
    storeId: 2,
    products: [
      {
        name: "Худи Oversize",
        newPrice: "3 200",
        oldPrice: "+ 1 бесплатно",
        badge: "1+1",
        emoji: "👕",
      },
      {
        name: "Джоггеры Sport",
        newPrice: "2 800",
        oldPrice: "+ 1 бесплатно",
        badge: "1+1",
        emoji: "👖",
      },
      {
        name: "Кепка Sport Cap",
        newPrice: "1 400",
        oldPrice: "+ 1 бесплатно",
        badge: "1+1",
        emoji: "🧢",
      },
    ],
    moreCount: 18,
  },
  {
    id: 3,
    store: "Adidas Store KG",
    storeCode: "AD",
    verified: true,
    promoTag: "Новая коллекция",
    title: "Весна 2026 —",
    accent: "−30% на старт",
    sub: "Встречай сезон в новых образах. Скидка 30% на всю весеннюю коллекцию одежды и обуви Adidas.",
    deadline: "1 мая 2026",
    decoNum: "−30%",
    color: "blue",
    storeId: 3,
    products: [
      {
        name: "Ultraboost 22",
        newPrice: "13 300",
        oldPrice: "19 000",
        badge: "−30%",
        emoji: "👟",
      },
      {
        name: "Tiro Track Jacket",
        newPrice: "6 230",
        oldPrice: "8 900",
        badge: "−30%",
        emoji: "🧥",
      },
      {
        name: "Tiro 23 Pants",
        newPrice: "3 500",
        oldPrice: "5 000",
        badge: "−30%",
        emoji: "👖",
      },
    ],
    moreCount: 31,
  },
  {
    id: 4,
    store: "Puma Mega Store",
    storeCode: "PM",
    verified: false,
    promoTag: "Фиксированная цена",
    title: "Любые кроссовки по",
    accent: "4 990 сом",
    sub: "Выбери любую пару из 500 моделей по единой цене. Акция ограничена — только 200 пар осталось!",
    deadline: "24 апреля 2026",
    decoNum: "4990",
    color: "amber",
    storeId: 4,
    products: [
      {
        name: "RS-X Puzzle",
        newPrice: "4 990",
        oldPrice: "11 200",
        badge: "−55%",
        emoji: "👟",
      },
      {
        name: "Suede Classic",
        newPrice: "4 990",
        oldPrice: "8 700",
        badge: "−43%",
        emoji: "👟",
      },
      {
        name: "Future Rider",
        newPrice: "4 990",
        oldPrice: "9 500",
        badge: "−47%",
        emoji: "👟",
      },
    ],
    moreCount: 197,
  },
];

const Advertising: FC = () => {
  const router = useRouter();

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
            loop={true}
            className={scss.swiper}
          >
            {BANNERS.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className={`${scss.slide} ${scss[banner.color]}`}>
                  <span className={scss.decoNum}>{banner.decoNum}</span>

                  <div className={scss.left}>
                    <div className={scss.storeRow}>
                      <div className={scss.storeAv}>{banner.storeCode}</div>
                      <span className={scss.storeNm}>{banner.store}</span>
                      {banner.verified && (
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

                    <p className={scss.sub}>{banner.sub}</p>

                    <div className={scss.deadlineRow}>
                      <span className={scss.dlLabel}>Акция до</span>
                      <span className={scss.dlVal}>{banner.deadline}</span>
                    </div>

                    <button
                      className={scss.btn}
                      onClick={() => router.push(`/shops/${banner.storeId}`)}
                    >
                      Смотреть товары →
                    </button>
                  </div>

                  <div className={scss.right}>
                    <span className={scss.rightLabel}>Товары по акции</span>
                    {banner.products.map((p, i) => (
                      <div key={i} className={scss.prodCard}>
                        <div className={scss.prodImg}>{p.emoji}</div>
                        <div className={scss.prodInfo}>
                          <div className={scss.prodName}>{p.name}</div>
                          <div className={scss.prodPrices}>
                            <span className={scss.prodNew}>
                              {p.newPrice} сом
                            </span>
                            <span className={scss.prodOld}>{p.oldPrice}</span>
                          </div>
                        </div>
                        <span className={scss.prodBadge}>{p.badge}</span>
                      </div>
                    ))}
                    <span className={scss.moreLink}>
                      Ещё {banner.moreCount} товаров →
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
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
