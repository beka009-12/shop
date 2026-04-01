"use client";
import { type FC } from "react";
import scss from "../../../components/pages/orderSections/Order.module.scss";

interface OrderSkeletonProps {
  count?: number;
}

const OrderSkeleton: FC<OrderSkeletonProps> = ({ count = 3 }) => {
  return (
    <section className={scss.order}>
      <div className="container">
        <div className={scss.header}>
          <div className={scss.headerLeft}>
            <div className={`${scss.skEl} ${scss.skTitle}`} />
            <div className={`${scss.skEl} ${scss.skCount}`} />
          </div>
        </div>

        <div className={scss.grid}>
          <div className={scss.items}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={scss.card}>
                <div
                  className={`${scss.imgWrap} ${scss.skEl}`}
                  style={{ cursor: "default" }}
                />
                <div className={scss.cardBody}>
                  <div className={scss.cardTop}>
                    <div className={`${scss.skEl} ${scss.skName}`} />
                    <div className={`${scss.skEl} ${scss.skPrice}`} />
                  </div>
                  <div className={`${scss.skEl} ${scss.skBrand}`} />
                  <div
                    className={scss.cardFoot}
                    style={{ marginTop: "auto", paddingTop: 8 }}
                  >
                    <div className={`${scss.skEl} ${scss.skCounter}`} />
                    <div className={`${scss.skEl} ${scss.skDel}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={scss.summary}>
            <div className={`${scss.skEl} ${scss.skSumRow}`} />
            <div className={`${scss.skEl} ${scss.skSumRow}`} />
            <div className={`${scss.skEl} ${scss.skPromo}`} />
            <div className={scss.sumDivider} />
            <div className={`${scss.skEl} ${scss.skTotal}`} />
            <div className={`${scss.skEl} ${scss.skBtn}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSkeleton;
