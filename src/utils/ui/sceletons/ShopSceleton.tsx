import { type FC } from "react";
import scss from "./ShopSceleton.module.scss";

const s = `${scss.sh} `;

const ShopSceleton: FC = () => {
  return (
    <div className={scss.ShopSceleton}>
      <div className="container">

        {/* Top */}
        <div className={scss.top}>
          <div className={s + scss.pageTitle} />
          <div className={s + scss.searchBar} />
        </div>

        {/* Grid */}
        <div className={scss.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={scss.card}>
              <div className={s + scss.cover} />
              <div className={scss.body}>
                <div className={s + scss.name} />
                <div className={s + scss.region} />
                <div className={s + scss.desc} />
                <div className={s + scss.descShort} />
                <div className={s + scss.stats} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShopSceleton;
