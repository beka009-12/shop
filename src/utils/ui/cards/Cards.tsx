"use client";
import { useState, type FC, useEffect } from "react";
import scss from "./Cards.module.scss";
import { useRouter } from "next/navigation";

interface IBaseCard {
  id: number;
  storeId: number;
  categoryId: number;
  brandName?: string | null;
  title: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number | null;
  stockCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
    logo?: string | null;
    isVerified: boolean;
    rating?: number | null;
  };
}

const Cards: FC<IBaseCard> = ({
  id,
  title,
  description,
  images = [],
  price,
  oldPrice,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleClick = () => {
    router.push(`/detail/${id}`);
  };

  return (
    <div className={scss.card}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentIndex(0);
        }}
        className={scss.imageWrapper}
        onClick={handleClick}
      >
        <div className={scss.imageScroller}>
          {images.map((src, i) => (
            <img
              loading="lazy"
              key={i}
              src={src}
              alt={title || "product"}
              className={`${scss.image} ${
                i === currentIndex ? scss.active : ""
              }`}
            />
          ))}
        </div>

        <button onClick={handleClick} className={scss.quickView}>
          Подробнее
        </button>
      </div>

      <div className={scss.info}>
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
        {price !== undefined && (
          <p className={scss.price}>
            {oldPrice ? (
              <>
                <span className={scss.oldPrice}>{oldPrice} сом</span>
                <span className={scss.oldPrice}>{price} сом</span>
              </>
            ) : (
              <span className={scss.defaultPrice}>{price} сом</span>
            )}
          </p>
        )}
        <button className={scss.btn}>
          Добавить{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={scss.cartIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Cards;
