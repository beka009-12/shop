import { type FC } from "react";
import scss from "./OrderSceleton.module.scss";

const OrderSkeleton: FC = () => (
  <div className={scss.orderBox}>
    <div className={scss.box}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={scss.orderCard}>
          <div className={scss.imageWrapper}>
            <div className={`${scss.skeleton} ${scss.skeletonImage}`} />
          </div>
          <div className={scss.cardInfo}>
            <div className={scss.top}>
              <div className={`${scss.skeleton} ${scss.skeletonTitle}`} />
              <div className={`${scss.skeleton} ${scss.skeletonPrice}`} />
            </div>
            <div className={scss.props}>
              <div className={`${scss.skeleton} ${scss.skeletonText}`} />
            </div>
            <div className={scss.actions}>
              <div className={`${scss.skeleton} ${scss.skeletonCounter}`} />
              <div className={`${scss.skeleton} ${scss.skeletonRemove}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className={scss.summary}>
      <div className={`${scss.skeleton} ${scss.skeletonTotal}`} />
      <div className={`${scss.skeleton} ${scss.skeletonBtnBig}`} />
    </div>
  </div>
);

export default OrderSkeleton;
