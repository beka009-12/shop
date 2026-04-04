"use client";
import { type FC, useState } from "react";
import scss from "./Shop.module.scss";
import { useGetAllStores } from "@/api/store";
import { useRouter } from "next/navigation";

const Shop: FC = () => {
  const { data: stores, isLoading } = useGetAllStores();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = stores?.stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.region || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Инициалы из названия магазина
  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  if (isLoading) {
    return (
      <section className={scss.shop}>
        <div className="container">
          <div className={scss.top}>
            <div className={`${scss.skEl} ${scss.skPageTitle}`} />
          </div>
          <div className={scss.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`${scss.card} ${scss.skCard}`}>
                <div className={`${scss.cover} ${scss.skEl}`} />
                <div className={scss.body}>
                  <div className={`${scss.skEl} ${scss.skName}`} />
                  <div className={`${scss.skEl} ${scss.skRegion}`} />
                  <div className={`${scss.skEl} ${scss.skDesc}`} />
                  <div
                    className={`${scss.skEl} ${scss.skDesc}`}
                    style={{ width: "70%" }}
                  />
                  <div className={`${scss.skEl} ${scss.skStats}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={scss.shop}>
      <div className="container">
        {/* Top */}
        <div className={scss.top}>
          <div className={scss.titleBlock}>
            <h1 className={scss.pageTitle}>Магазины</h1>
            {filtered && (
              <span className={scss.pageCount}>
                {filtered.length} магазинов
              </span>
            )}
          </div>

          <div className={scss.searchWrap}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              placeholder="Найти магазин или город..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Empty search */}
        {filtered?.length === 0 && (
          <div className={scss.empty}>
            <p className={scss.emptyTitle}>Магазины не найдены</p>
            <p className={scss.emptySub}>Попробуйте другой запрос</p>
          </div>
        )}

        {/* Grid */}
        <div className={scss.grid}>
          {filtered?.map((store) => (
            <div
              key={store.id}
              className={scss.card}
              onClick={() => router.push(`/shops/${store.id}`)}
            >
              {/* Cover */}
              <div className={scss.cover}>
                {store.isVerified && (
                  <span className={scss.verified}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Проверен
                  </span>
                )}

                {/* Logo */}
                <div className={scss.logoWrap}>
                  {store.logo ? (
                    <img src={store.logo} alt={store.name} />
                  ) : (
                    <div className={scss.logoIni}>
                      {getInitials(store.name)}
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className={scss.body}>
                <p className={scss.shopName}>{store.name}</p>

                {store.region && (
                  <p className={scss.shopRegion}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
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
                    {store.region}
                  </p>
                )}

                {store.description && (
                  <p className={scss.shopDesc}>{store.description}</p>
                )}

                <div className={scss.stats}>
                  {store.rating && (
                    <div className={scss.stat}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f59e0b"
                        stroke="none"
                      >
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                      <span className={scss.statVal}>{store.rating}</span>
                    </div>
                  )}

                  {store.rating && store._count?.products && (
                    <div className={scss.sep} />
                  )}

                  {store._count?.products !== undefined && (
                    <div className={scss.stat}>
                      <span className={scss.statVal}>
                        {store._count.products}
                      </span>{" "}
                      товаров
                    </div>
                  )}

                  <span className={scss.viewBtn}>Смотреть →</span>
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
