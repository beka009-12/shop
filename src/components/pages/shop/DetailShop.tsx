"use client";
import { type FC } from "react";
import scss from "./DetailShop.module.scss";
import { useParams } from "next/navigation";
import { useGetDetailStore } from "@/api/store";
import Grid from "@/utils/ui/cards/Grid";

const DetailShop: FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetDetailStore(Number(id));

  const store = data?.store;

  if (isLoading) return <div className={scss.loading}>Загрузка...</div>;
  if (!store) return <div className={scss.notFound}>Магазин не найден</div>;

  return (
    <section className={scss.DetailShop}>
      <div className="container">
        <div className={scss.wrapper}>
          {/* Левая колонка — данные магазина */}
          <aside className={scss.sidebar}>
            {store.isVerified && (
              <div className={scss.verifiedBadge}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={scss.verifiedIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                <span>Проверенный магазин</span>
              </div>
            )}

            <div className={scss.logoWrapper}>
              <img src={store.logo || ""} alt={store.name} />
            </div>

            <h1 className={scss.storeName}>{store.name}</h1>

            {store.description && (
              <p className={scss.description}>{store.description}</p>
            )}

            <div className={scss.infoGrid}>
              <div className={scss.infoItem}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>{store.region}</span>
              </div>

              <div className={scss.infoItem}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <span>{store.rating ?? "—"}</span>
              </div>
            </div>

            {store.address && (
              <>
                <div className={scss.addressSection}>
                  <h3 className={scss.sectionTitle}>Адрес</h3>
                  <p className={scss.address}>{store.address}</p>
                </div>

                <div className={scss.mapContainer}>
                  <iframe
                    title="Местоположение магазина"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      store.address,
                    )}&output=embed`}
                    allowFullScreen
                    width="100%"
                    height="200"
                    loading="lazy"
                    className={scss.mapIframe}
                  ></iframe>
                </div>
              </>
            )}
          </aside>

          {/* Правая колонка — товары */}
          <div className={scss.productsSection}>
            <h2 className={scss.productsTitle}>
              Товары магазина
              {store.products?.length > 0 && (
                <span className={scss.productsCount}>
                  ({store.products.length})
                </span>
              )}
            </h2>
            <Grid products={store.products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailShop;
