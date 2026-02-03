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
              <div className={scss.verifiedBadge} title="Проверенный магазин">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={scss.verifiedBadgeIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
            )}

            <div className={scss.logo}>
              <img src={store.logo || ""} alt={store.name} />
            </div>

            <h1 className={scss.name}>{store.name}</h1>

            {store.description && (
              <p className={scss.desc}>{store.description}</p>
            )}

            <div className={scss.meta}>
              <span className={scss.region}>{store.region}</span>
              <span className={scss.rating}>⭐ {store.rating ?? "—"}</span>
            </div>

            {store.address && <p className={scss.address}>{store.address}</p>}
          </aside>

          {/* Правая колонка — товары */}
          <div className={scss.products}>
            <Grid products={store.products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailShop;
