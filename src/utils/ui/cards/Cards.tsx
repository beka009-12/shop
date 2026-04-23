"use client";
import { useState, type FC, useEffect } from "react";
import scss from "./Cards.module.scss";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/api/user";
import {
  useCartAddAction,
  useDelFavorite,
  useFavoriteFun,
} from "@/hooks/useCartActions";
import Image from "next/image";
import { useGetOrderCartUserId } from "@/api/generated/endpoints/order/order";
import { useGetFavoriteFavoriteUserId } from "@/api/generated/endpoints/favorite/favorite";

interface IBaseCard {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  newPrice?: number | null;
}

const Cards: FC<IBaseCard> = ({
  id,
  title,
  description,
  images = [],
  price,
  newPrice,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useCartAddAction();
  const { addToFavorite } = useFavoriteFun();
  const { handleRemove } = useDelFavorite();

  const { data: me } = useGetMe();
  const userId = me?.user?.id;

  const { data: favorite } = useGetFavoriteFavoriteUserId(userId as number);

  const { data: cartItems } = useGetOrderCartUserId(Number(userId));
  const isInCart = cartItems?.some((item) => item.product?.id === id);
  const isFavorite = favorite?.favorites?.some(
    (item: any) => item.product.id === id,
  );

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const discountPercent =
    newPrice && price > newPrice
      ? Math.round(((price - newPrice) / price) * 100)
      : 0;

  const handleClick = () => router.push(`/detail/${id}`);
  const handleHover = () => router.prefetch(`/detail/${id}`);

  const onFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isFavorite ? handleRemove(id) : addToFavorite(id);
  };

  return (
    <div className={scss.card}>
      {/* Image area */}
      <div
        className={scss.imageWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentIndex(0);
        }}
        onClick={handleClick}
      >
        <div className={scss.imageScroller}>
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={title}
              onMouseEnter={handleHover}
              className={`${scss.image} ${i === currentIndex ? scss.active : ""}`}
              width={300}
              height={300}
            />
          ))}
        </div>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className={scss.discount}>−{discountPercent}%</span>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className={scss.dots}>
            {images.map((_, i) => (
              <span
                key={i}
                className={`${scss.dot} ${i === currentIndex ? scss.dotActive : ""}`}
              />
            ))}
          </div>
        )}

        {/* Favorite button */}
        <button
          className={`${scss.favoriteBtn} ${isFavorite ? scss.favoriteBtnActive : ""}`}
          onClick={onFavoriteClick}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className={scss.favoriteIcon}
            width="24"
            height="24"
            fill={isFavorite ? "#E24B4A" : "none"}
            stroke={isFavorite ? "#E24B4A" : "currentColor"}
            strokeWidth="16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M128,216S24,160,24,92A56,56,0,0,1,128,72a56,56,0,0,1,104,20C232,160,128,216,128,216Z"
            />
          </svg>
        </button>
      </div>

      {/* Info area */}
      <div className={scss.info}>
        <div className={scss.textBlock}>
          <h3 className={scss.title}>{title}</h3>
          <p className={scss.desc}>{description}</p>
        </div>

        {/* Price */}
        <div className={scss.priceRow}>
          <span className={scss.priceMain}>
            {newPrice ? newPrice : price} сом
          </span>
          {newPrice && <span className={scss.priceOld}>{price} сом</span>}
        </div>

        {/* Cart button */}
        <button
          className={`${scss.btn} ${isInCart ? scss.inCart : ""}`}
          disabled={isInCart}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(id);
            `${isInCart ? "Добавлено в корзину" : "Добавить в корзину"}`;
          }}
          aria-label={isInCart ? "Добавлено в корзину" : "Добавить в корзину"}
        >
          {isInCart ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={scss.checkIcon}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              В корзине
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="1.8"
                className={scss.cartIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              В корзину
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Cards;
