"use client";
import { useState, type FC, useEffect } from "react";
import scss from "./Cards.module.scss";
import { useRouter } from "next/navigation";
import { useGetOrders } from "@/api/order";
import { useGetMe } from "@/api/user";
import {
  useCartAddAction,
  useDelFavorite,
  useFavoriteFun,
} from "@/hooks/useCartActions";
import { useGetFavorites } from "@/api/favorite";

interface IBaseCard {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number | null;
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

  const { addToCart } = useCartAddAction();
  const { addToFavorite } = useFavoriteFun();
  const { handleRemove, isDeleting } = useDelFavorite();

  const { data: me } = useGetMe();
  const userId = me?.user?.id;

  const { data: orders } = useGetOrders(userId as number);
  const { data: favorite } = useGetFavorites(userId as number);

  const isInCart = orders?.some((item: any) => item.product.id === id);
  const isFavorite = favorite?.favorites?.some(
    (item: any) => item.product.id === id,
  );

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // ✅ правильный расчёт скидки
  const discountPercent =
    oldPrice && price > oldPrice
      ? Math.round(((price - oldPrice) / price) * 100)
      : 0;

  const handleClick = () => router.push(`/detail/${id}`);
  const handleHover = () => router.prefetch(`/detail/${id}`);

  const onFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      handleRemove(id);
    } else {
      addToFavorite(id);
    }
  };

  return (
    <div className={scss.card}>
      <div
        className={scss.imageWrapper}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentIndex(0);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onClick={handleClick}
      >
        <div className={scss.imageScroller}>
          {images.map((src, i) => (
            <img
              loading="lazy"
              key={i}
              onMouseEnter={handleHover}
              src={src}
              alt={title}
              className={`${scss.image} ${
                i === currentIndex ? scss.active : ""
              }`}
            />
          ))}
        </div>

        {discountPercent > 0 ? (
          <span className={scss.discount}>-{discountPercent}%</span>
        ) : null}

        {/* ❤️ избранное */}
        {isFavorite ? (
          <button
            className={scss.favoriteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFavorite ? "red" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={isFavorite ? "red" : "currentColor"}
              className={`${scss.favoriteIcon} ${
                isFavorite ? scss.favoriteActive : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        ) : (
          <button
            className={scss.favoriteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={!isFavorite ? "red" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={!isFavorite ? "red" : "currentColor"}
              className={`${scss.favoriteIcon} ${
                isFavorite ? scss.favoriteActive : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={scss.info}>
        <h3>{title}</h3>
        <p>{description}</p>

        {/* 💰 цены */}
        <p className={scss.price}>
          {oldPrice ? (
            <>
              <span className={scss.defaultPrice}>{oldPrice} сом</span>
              <span className={scss.oldPrice}>{price} сом</span>
            </>
          ) : (
            <span className={scss.defaultPrice}>{price} сом</span>
          )}
        </p>

        {/* 🛒 корзина */}
        <button
          className={`${scss.btn} ${isInCart ? scss.inCart : ""}`}
          disabled={isInCart}
          onClick={() => addToCart(id)}
        >
          {isInCart ? "Уже в корзине" : "Добавить в"}
          {!isInCart && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={scss.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Cards;
