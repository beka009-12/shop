import { type FC } from "react";
import scss from "./CardSceleton.module.scss";

const CardSceleton: FC = () => {
  return (
    <div className={scss.CardSceleton}>
      <div className={`${scss.imageArea} ${scss.shimmer}`} />
      <div className={scss.info}>
        <div className={`${scss.titleLine} ${scss.shimmer}`} />
        <div className={`${scss.descLine} ${scss.shimmer}`} />
        <div className={scss.priceRow}>
          <div className={`${scss.priceLine} ${scss.shimmer}`} />
          <div className={`${scss.priceOldLine} ${scss.shimmer}`} />
        </div>
        <div className={`${scss.btnLine} ${scss.shimmer}`} />
      </div>
    </div>
  );
};

export default CardSceleton;
