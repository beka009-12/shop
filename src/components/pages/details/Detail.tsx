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

  if (isPending) return <Loader />;
  if (!product) return <div>Продукт не найден</div>;

  const mainImage = activeImage || product.images?.[0];

  return (
    <section className={scss.detail}>
      <div className={scss.container}>
        <div className={scss.galleryWrapper}>
          <div className={scss.thumbnails}>
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} preview ${i}`}
                className={`${scss.thumb} ${
                  mainImage === img ? scss.activeThumb : ""
                }`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>

          <div className={scss.mainImageWrapper}>
            <img
              src={mainImage}
              alt={product.title}
              className={scss.mainImage}
            />
          </div>
        </div>

        <div className={scss.info}>
          <div className={scss.brandInfo}>
            <span className={scss.brandTitle}>{brand?.name}</span>
            {product.tags?.map((item, index) => (
              <span key={index} className={scss.brandTitle}>
                {item}
              </span>
            ))}
          </div>
          <div className={scss.topBlock}>
            <h1 className={scss.title}>{product.title}</h1>
          </div>

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

          {product.colors?.length ? (
            <div className={scss.colors}>
              <h4>Цвета:</h4>
              <div className={scss.colorList}>
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className={scss.colorCircle}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes?.length ? (
            <div className={scss.sizes}>
              <h4>Размеры:</h4>
              <div className={scss.sizeList}>
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    className={`${scss.sizeBtn} ${
                      selectedSize === size ? scss.activeSize : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className={scss.actions}>
            <button className={scss.orderBtn}>Добавить в корзину</button>
            <button className={scss.favoriteBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={scss.heartIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              В избранное
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
