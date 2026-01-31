"use client";
import { FC } from "react";
import scss from "./Favorite.module.scss";
import { useGetFavorites } from "@/api/favorite";
import { useGetMe } from "@/api/user";
import Cards from "@/utils/ui/cards/Cards";

const Favorite: FC = () => {
  const { data: me } = useGetMe();
  const { data: favoriteData } = useGetFavorites(me?.user.id!);

  if (!favoriteData || favoriteData.favorites.length === 0) {
    return <div className={scss.empty}>У вас нет избранных товаров</div>;
  }

  return (
    <section className={scss.Favorite}>
      <div className="container">
        <h1 className={scss.title}>Избранное</h1>
        <div className={scss.grid}>
          {favoriteData.favorites.map((fav) => {
            return <Cards {...fav.product} key={fav.productId} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Favorite;
