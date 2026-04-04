"use client";
import { FC } from "react";
import scss from "./Favorite.module.scss";
import { useGetFavorites } from "@/api/favorite";
import { useGetMe } from "@/api/user";
import { useRouter } from "next/navigation";
import Grid from "@/utils/ui/cards/Grid";

const Favorite: FC = () => {
  const router = useRouter();
  const { data: me } = useGetMe();
  const userId = me?.user?.id;

  const { data: favoriteData, isLoading, isError } = useGetFavorites(userId!);

  const favoriteProducts =
    favoriteData?.favorites?.map((fav) => fav.product) ?? [];

  return (
    <section className={scss.favorite}>
      <div className="container">
        {/* Header */}
        <div className={scss.header}>
          <div className={scss.headerLeft}>
            <h1 className={scss.title}>Избранное</h1>
            {!isLoading && favoriteProducts.length > 0 && (
              <span className={scss.count}>
                {favoriteProducts.length} товара
              </span>
            )}
          </div>
        </div>

        {/* Empty state — показываем только если загрузка завершена и товаров нет */}
        {!isLoading && favoriteProducts.length === 0 && (
          <div className={scss.empty}>
            <div className={scss.emptyIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <h2 className={scss.emptyTitle}>Здесь пока пусто</h2>
            <p className={scss.emptySub}>
              Добавляйте товары в избранное, чтобы не потерять
            </p>
            <button className={scss.emptyBtn} onClick={() => router.push("/")}>
              Перейти в каталог
            </button>
          </div>
        )}

        {/* ИСПОЛЬЗУЕМ GRID */}
        {(isLoading || favoriteProducts.length > 0) && (
          <Grid
            products={favoriteProducts}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </div>
    </section>
  );
};

export default Favorite;
