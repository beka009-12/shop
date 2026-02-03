"use client";
import { type FC } from "react";
import scss from "./Shop.module.scss";
import { useGetAllStores } from "@/api/store";
import { useRouter } from "next/navigation";

const Shop: FC = () => {
  const { data: stores } = useGetAllStores();
  const router = useRouter();

  return (
    <section className={scss.Shop}>
      <div className="container">
        <div className={scss.shopsBox}>
          {stores?.stores.map((store) => (
            <div
              onClick={() => router.push(`/shops/${store.id}`)}
              className={scss.card}
              key={store.id}
            >
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
                <img src={store.logo!} alt={store.name} />
              </div>

              <div className={scss.info}>
                <h2>{store.name}</h2>

                <p className={scss.desc}>{store.description}</p>

                <span className={scss.region}>{store.region}</span>

                <div className={scss.bottom}>
                  <div className={scss.rating}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={scss.star}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>

                    {store.rating}
                  </div>

                  <div className={scss.products}>
                    {store._count.products}
                    <span>товаров</span>
                  </div>
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
