import { type FC } from "react";
import scss from "./AdvertisingSceleton.module.scss";

const s = `${scss.sh} `;

const AdvertisingSceleton: FC = () => {
  return (
    <div className={scss.wrap}>
      <div className="container">
        <div className={scss.slide}>
          {/* ── Left ── */}
          <div className={scss.left}>
            <div className={scss.storeRow}>
              <div className={s + scss.storeAv} />
              <div className={s + scss.storeNm} />
            </div>
            <div className={s + scss.promoTag} />
            <div className={s + scss.titleLine1} />
            <div className={s + scss.titleLine2} />
            <div className={s + scss.subLine1} />
            <div className={s + scss.subLine2} />
            <div className={scss.deadlineRow}>
              <div className={s + scss.dlLabel} />
              <div className={s + scss.dlVal} />
            </div>
            <div className={s + scss.btn} />
          </div>

          {/* ── Right ── */}
          <div className={scss.right}>
            <div className={s + scss.rightLabel} />
            {[0, 1, 2].map((i) => (
              <div key={i} className={scss.prodCard}>
                <div className={s + scss.prodImg} />
                <div className={scss.prodInfo}>
                  <div className={s + scss.prodName} />
                  <div className={s + scss.prodPrice} />
                </div>
              </div>
            ))}
            <div className={s + scss.moreLink} />
          </div>
        </div>

        <div className={scss.navControls}>
          <div className={scss.navBtn} />
          <div className={scss.navBtn} />
        </div>
      </div>
    </div>
  );
};

export default AdvertisingSceleton;
