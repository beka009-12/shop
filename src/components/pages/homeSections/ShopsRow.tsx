// src/components/pages/homeSections/ShopsRow.tsx
"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import scss from "./ShopsRow.module.scss";
import { useGetShops } from "@/api/generated/endpoints/shops/shops";
import { ShopSummary } from "@/api/generated/models";

const MAX_SHOPS = 8;

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ShopsRow: FC = () => {
  const router = useRouter();
  const { data, isPending } = useGetShops();
  const shops = ((data?.shops ?? []) as ShopSummary[]).slice(0, MAX_SHOPS);

  return (
    <div className={scss.section}>
      <div className={scss.header}>
        <h2 className={scss.title}>Магазины</h2>
        <button className={scss.viewAll} onClick={() => router.push("/shops")}>
          Все магазины →
        </button>
      </div>

      <div className={scss.scroll}>
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={scss.skCard} />
            ))
          : shops.map((store) => (
              <div
                key={store.id}
                className={scss.card}
                onClick={() => router.push(`/shops/${store.id}`)}
              >
                <div className={scss.cover}>
                  {store.isVerified && (
                    <span className={scss.verified}>✓ Проверен</span>
                  )}
                  <div className={scss.logoWrap}>
                    {store.logo ? (
                      <img src={store.logo} alt={store.name ?? ""} />
                    ) : (
                      <div className={scss.logoIni}>
                        {getInitials(store.name ?? "")}
                      </div>
                    )}
                  </div>
                </div>
                <div className={scss.body}>
                  <p className={scss.shopName}>{store.name}</p>
                  <p className={scss.meta}>
                    {store.rating ? `⭐ ${store.rating}` : ""}
                    {store.rating && store._count?.products ? " · " : ""}
                    {store._count?.products
                      ? `${store._count.products} товаров`
                      : ""}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ShopsRow;
