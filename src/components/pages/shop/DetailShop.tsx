"use client";
import { type FC } from "react";
import scss from "./DetailShop.module.scss";
import { useParams } from "next/navigation";
import { useGetDetailStore } from "@/api/store";
import DetailShopSkeleton from "@/utils/ui/sceletons/DetailShopSceleton";
import Grid from "@/utils/ui/cards/Grid"; // Импортируем ваш Grid

const DetailShop: FC = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetDetailStore(Number(id));

  const store = data?.store;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  if (isLoading) return <DetailShopSkeleton />;
  if (!store) return <div className={scss.notFound}>Магазин не найден</div>;

  return (
    <section className={scss.detailShop}>
      {/* ── Hero cover ── */}
      <div className={scss.hero}>
        <div className={scss.heroOverlay} />
        {store.isVerified && (
          <span className={scss.verified}>
            {/* SVG иконка */}
            Проверен
          </span>
        )}
        <div className={scss.logoAnchor}>
          {store.logo ? (
            <img src={store.logo} alt={store.name} />
          ) : (
            <span>{getInitials(store.name)}</span>
          )}
        </div>
      </div>

      {/* ── Info bar ── */}
      <div className={scss.infoBar}>
        <div className={scss.infoLeft}>
          <h1 className={scss.storeName}>{store.name}</h1>
          <div className={scss.metaRow}>
            {store.region && (
              <div className={scss.metaItem}>{store.region}</div>
            )}
            {store.rating && (
              <div className={scss.metaItem}>⭐ {store.rating}</div>
            )}
            {store.products?.length > 0 && (
              <div className={scss.metaItem}>
                {store.products.length} товаров
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="container">
        <div className={scss.content}>
          {/* Sidebar */}
          <aside className={scss.sidebar}>
            {store.description && (
              <div className={scss.sCard}>
                <p className={scss.sHead}>Описание</p>
                <p className={scss.descText}>{store.description}</p>
              </div>
            )}
          </aside>

          {/* Products Main Section */}
          <div className={scss.main}>
            <div className={scss.prodHead}>
              <h2 className={scss.prodTitle}>Товары магазина</h2>
            </div>

            {!store.products?.length ? (
              <div className={scss.noProducts}>
                <p>В магазине пока нет товаров</p>
              </div>
            ) : (
              <Grid
                products={store.products}
                isLoading={isLoading}
                isError={isError}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailShop;
