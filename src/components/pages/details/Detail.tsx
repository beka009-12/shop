"use client";
import { useState, type FC } from "react";
import { useParams } from "next/navigation";
import { useGetBrandById, useGetProductById } from "@/api/product";
import scss from "./Detail.module.scss";
import Loader from "@/utils/loader/Loader";

const Detail: FC = () => {
  const { id } = useParams();
  const { data: product, isPending } = useGetProductById(Number(id));
  const brandId = product?.brandId;
  const { data: brand } = useGetBrandById(brandId);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (isPending) return <Loader />;
  if (!product) return <div className={scss.notFound}>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];

  return (
    <section className={scss.detail}>
      <div className={scss.container}>
        {/* === ГАЛЕРЕЯ === */}
        <div className={scss.gallery}>
          <div className={scss.thumbnails}>
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`${scss.thumb} ${
                  mainImage === img ? scss.activeThumb : ""
                }`}
                aria-label={`Просмотр изображения ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.title} — превью ${i + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <div className={scss.mainImageWrapper}>
            <img
              src={mainImage}
              alt={product.title}
              className={scss.mainImage}
              loading="lazy"
            />
          </div>
        </div>

        {/* === ИНФО === */}
        <div className={scss.info}>
          <div className={scss.brandInfo}>
            <span className={scss.brandPill}>{brand?.name}</span>
            {product.tags?.map((tag, i) => (
              <span key={i} className={scss.brandPill}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className={scss.title}>{product.title}</h1>

          <div className={scss.priceBlock}>
            {product.newPrice ? (
              <>
                <span className={scss.newPrice}>{product.newPrice} сом</span>
                <span className={scss.oldPrice}>{product.price} сом</span>
              </>
            ) : (
              <span className={scss.price}>{product.price} сом</span>
            )}
          </div>

          <p className={scss.description}>{product.description}</p>

          {/* Цвета */}
          {product.colors?.length ? (
            <div className={scss.colors}>
              <h4>Цвет:</h4>
              <div className={scss.colorList}>
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`${scss.colorCircle} ${
                      selectedColor === color ? scss.activeColor : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Выбрать цвет ${color}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={scss.checkIcon}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Размеры */}
          {product.sizes?.length ? (
            <div className={scss.sizes}>
              <h4>Размер:</h4>
              <div className={scss.sizeList}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${scss.sizeBtn} ${
                      selectedSize === size ? scss.activeSize : ""
                    }`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className={scss.actions}>
            <button className={scss.orderBtn} aria-label="Добавить в корзину">
              В корзину
            </button>
            <button
              className={scss.favoriteBtn}
              aria-label="Добавить в избранное"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className={scss.heartIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
