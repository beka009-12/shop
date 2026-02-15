"use client";
import { type FC } from "react";
import scss from "./DetailShopSceleton.module.scss";

const DetailShopSkeleton: FC = () => {
  return (
    <section className={scss.DetailShopSkeleton}>
      <div className="container">
        <div className={scss.wrapper}>
          {/* Левая колонка — sidebar */}
          <aside className={scss.sidebar}>
            {/* Verified badge placeholder */}
            <div className={scss.verifiedPlaceholder} />

            {/* Логотип */}
            <div className={scss.logoSkeleton} />

            {/* Название магазина */}
            <div className={scss.titleSkeleton} />

            {/* Описание — 3 строки */}
            <div className={scss.descriptionSkeleton}>
              <div className={scss.line} />
              <div className={scss.line} style={{ width: "85%" }} />
              <div className={scss.line} style={{ width: "60%" }} />
            </div>

            {/* Инфо-грид (регион + рейтинг) */}
            <div className={scss.infoGrid}>
              <div className={scss.infoItem}>
                <div className={scss.iconPlaceholder} />
                <div className={scss.textLine} style={{ width: "70%" }} />
              </div>
              <div className={scss.infoItem}>
                <div className={scss.iconPlaceholder} />
                <div className={scss.textLine} style={{ width: "40%" }} />
              </div>
            </div>

            {/* Адрес + карта */}
            <div className={scss.addressSection}>
              <div className={scss.sectionTitleSkeleton} />
              <div className={scss.textLine} style={{ width: "90%" }} />
              <div className={scss.textLine} style={{ width: "65%" }} />
            </div>

            <div className={scss.mapSkeleton} />
          </aside>

          {/* Правая колонка — товары */}
          <div className={scss.productsSection}>
            <div className={scss.productsTitleSkeleton}>
              <div className={scss.titleLine} />
              <div className={scss.countLine} />
            </div>

            {/* Сетка карточек товаров */}
            <div className={scss.gridSkeleton}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={scss.productCardSkeleton}>
                  <div className={scss.productImage} />
                  <div className={scss.productTitle} />
                  <div className={scss.productPrice} />
                  <div className={scss.productRating} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailShopSkeleton;
