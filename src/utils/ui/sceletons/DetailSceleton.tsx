import { type FC } from "react";
import scss from "./DetailSceleton.module.scss";

const s = `${scss.sh} `;

const DetailSceleton: FC = () => {
  return (
    <section className={scss.detail}>
      <div className="container">

        {/* ── Back bar ── */}
        <div className={scss.topBar}>
          <div className={s + scss.backBtn} />
        </div>

        <div className={scss.container}>

          {/* ── Gallery ── */}
          <div className={scss.gallery}>
            <div className={scss.thumbnails}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={s + scss.thumb} />
              ))}
            </div>
            <div className={s + scss.mainImage} />
          </div>

          {/* ── Info ── */}
          <div className={scss.info}>

            {/* Store header */}
            <div className={scss.storeRow}>
              <div className={s + scss.storeAvatar} />
              <div>
                <div className={s + scss.storeName} />
                <div className={s + scss.storeRating} />
              </div>
            </div>

            {/* Title block */}
            <div className={scss.titleBlock}>
              <div className={s + scss.brand} />
              <div className={s + scss.title} />
              <div className={s + scss.titleSub} />
              <div className={scss.ratingRow}>
                <div className={s + scss.stars} />
                <div className={s + scss.reviewCount} />
              </div>
            </div>

            {/* Price */}
            <div className={scss.priceRow}>
              <div className={s + scss.priceMain} />
              <div className={s + scss.priceOld} />
            </div>

            <div className={scss.divider} />

            {/* Size grid */}
            <div>
              <div className={scss.sizeHead}>
                <div className={s + scss.sizeLabel} />
                <div className={s + scss.sizeGuide} />
              </div>
              <div className={scss.sizeGrid}>
                {["XS", "S", "M", "L", "XL", "XXL"].map((_, i) => (
                  <div key={i} className={s + scss.sizeBtn} />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className={s + scss.addBtn} />
            <div className={s + scss.secondaryBtn} />

          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailSceleton;
