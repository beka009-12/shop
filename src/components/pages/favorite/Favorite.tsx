"use client";
import { FC } from "react";
import scss from "./Favorite.module.scss";
import { useGetFavoriteFavorites } from "@/api/generated/endpoints/favorite/favorite";
import Grid from "@/utils/ui/cards/Grid";
import FavoriteNot from "@/utils/ui/noteF/FavoriteNot";

const Favorite: FC = () => {
  const { data: favoriteData, isLoading, isError } = useGetFavoriteFavorites();

  const favoriteProducts =
    favoriteData?.favorites
      ?.filter((fav) => fav.product)
      .map((fav) => ({
        id: fav.product?.id,
        title: fav.product?.title,
        price: fav.product?.price,
        newPrice: fav.product?.newPrice,
        isActive: fav.product?.isActive,
        productImages: fav.product?.images?.map((url) => ({ url })) ?? [],
      })) ?? [];

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

        {!isLoading && favoriteProducts.length === 0 && <FavoriteNot />}

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
