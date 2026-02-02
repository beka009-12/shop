"use client";
import { type FC } from "react";
import scss from "./Shop.module.scss";
import { useGetAllStores } from "@/api/store";

const Shop: FC = () => {
  const { data: stores, isLoading } = useGetAllStores();

  if (isLoading)
    return <div className={scss.loading}>Загрузка магазинов...</div>;

  return (
    <section className={scss.Shop}>
      <div className="container">
        <header className={scss.header}>
          <h1 className={scss.title}>Наши магазины</h1>
          <p className={scss.subtitle}>
            Выберите лучший магазин для ваших покупок
          </p>
        </header>

        <div className={scss.grid}>
          {stores?.stores.map((store) => (
            <div key={store.id} className={scss.card}>
              <div className={scss.imageWrapper}>
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className={scss.logoImg}
                  />
                ) : (
                  <div className={scss.placeholder}>{store.name.charAt(0)}</div>
                )}
                <div className={scss.ratingBadge}>⭐ {store.rating}</div>
              </div>

              <div className={scss.content}>
                <div className={scss.topInfo}>
                  <h2 className={scss.name}>{store.name}</h2>
                  <span className={scss.productCount}>
                    {store._count.products} товаров
                  </span>
                </div>

                <p className={scss.description}>{store.description}</p>

                <div className={scss.location}>
                  <span className={scss.region}>{store.region}</span>
                  <address className={scss.address}>{store.address}</address>
                </div>

                <div className={scss.footer}>
                  <div className={scss.tags}>
                    <span
                      className={`${scss.tag} ${store.isActive ? scss.active : ""}`}
                    >
                      {store.isActive ? "Активен" : "Неактивен"}
                    </span>
                    {store.isVerified && (
                      <span className={`${scss.tag} ${scss.verified}`}>
                        Проверен
                      </span>
                    )}
                  </div>
                  <button className={scss.btn}>Перейти</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;
