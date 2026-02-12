"use client";
import React, { type FC } from "react";
import scss from "../../../components/pages/orderSections/Order.module.scss";

const OrderCardSkeleton: FC = () => (
  <div className={scss.orderCard} style={{ pointerEvents: "none" }}>
    <div className={scss.imageWrapper}>
      <div
        className={scss.skeletonBox}
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
      />
    </div>

    <div className={scss.cardInfo}>
      <div className={scss.top}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            className={scss.skeletonBox}
            style={{ width: "60%", height: "22px", borderRadius: "6px" }}
          />
          <div
            className={scss.skeletonBox}
            style={{ width: "35%", height: "16px", borderRadius: "5px" }}
          />
        </div>
        <div
          className={scss.skeletonBox}
          style={{
            width: "90px",
            height: "24px",
            borderRadius: "6px",
            flexShrink: 0,
          }}
        />
      </div>

      <div className={scss.props}>
        <div
          className={scss.skeletonBox}
          style={{ width: "130px", height: "14px", borderRadius: "5px" }}
        />
      </div>

      <div className={scss.actions}>
        <div
          className={scss.skeletonBox}
          style={{ width: "108px", height: "42px", borderRadius: "10px" }}
        />
        <div
          className={scss.skeletonBox}
          style={{ width: "64px", height: "14px", borderRadius: "5px" }}
        />
      </div>
    </div>
  </div>
);

const SummarySkeleton: FC = () => (
  <div className={scss.summary}>
    <div className={scss.total}>
      <div
        className={scss.skeletonBox}
        style={{ width: "55px", height: "18px", borderRadius: "5px" }}
      />
      <div
        className={scss.skeletonBox}
        style={{ width: "120px", height: "30px", borderRadius: "6px" }}
      />
    </div>
    <div
      className={scss.skeletonBox}
      style={{ width: "100%", height: "52px", borderRadius: "12px" }}
    />
  </div>
);

interface OrderSkeletonProps {
  count?: number;
}

const OrderSkeleton: FC<OrderSkeletonProps> = ({ count = 3 }) => {
  return (
    <section className={scss.Order}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.header}>
            <div
              className={scss.skeletonBox}
              style={{ width: "180px", height: "42px", borderRadius: "8px" }}
            />
          </div>

          <div className={scss.orderBox}>
            <div className={scss.box}>
              {Array.from({ length: count }).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
            <SummarySkeleton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSkeleton;
