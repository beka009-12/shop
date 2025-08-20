"use client";
import { useState, type FC } from "react";
import scss from "./Cards.module.scss";
import { useRouter } from "next/navigation";

interface IBaseCard {
  id: number;
  shopId: number;
  category?: string;
  brand?: string;
  title?: string;
  description?: string;
  images?: string[];
  sizes?: number[] | string[];
  colors?: string[];
  price?: number;
  newPrice?: number;
  sale?: boolean;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  tags?: string[];
  createdAt?: string;
}

const Cards: FC<IBaseCard> = ({
  shopId,
  id,
  title,
  description,
  images,
  price,
  newPrice,
  sale,
  category,
  brand,
  sizes,
  colors,
  inStock,
  rating,
  reviews,
  tags,
  createdAt,
}) => {
  return (
    <>
      <div className={scss.card}>
        <div className={scss.imageWrapper}>
          <img
            src={
              images && images.length > 0 ? images[0] : "/default-avatar.png"
            }
            alt={title}
          />
          <button className={scss.quickView}>Подробнее</button>
        </div>

        <div className={scss.info}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
          {price !== undefined && (
            <p className={scss.price}>
              {sale && newPrice ? (
                <>
                  <span className={scss.oldPrice}>{price} сом</span>
                  <span className={scss.newPrice}>{newPrice} сом</span>
                </>
              ) : (
                <span className={scss.defultPrice}>{price} сом</span>
              )}
            </p>
          )}
          <button className={scss.btn}>Добавить</button>
        </div>
      </div>
    </>
  );
};

export default Cards;
