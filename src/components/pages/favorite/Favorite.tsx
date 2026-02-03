"use client";
import { FC } from "react";
import scss from "./Favorite.module.scss";
import { useGetFavorites } from "@/api/favorite";
import { useGetMe } from "@/api/user";
import Cards from "@/utils/ui/cards/Cards";

const Favorite: FC = () => {
  const { data: me } = useGetMe();
  const { data: favoriteData, isLoading } = useGetFavorites(me?.user.id!);

  return (
    <section className={scss.Favorite}>
      <div className="container">
        <h1 className={scss.title}>Избранное</h1>
        <div className={scss.grid}>
          {isLoading ? (
            <div>
              <div>Загрузка..</div>
            </div>
          ) : (
            favoriteData?.favorites.map((fav) => {
              return <Cards {...fav.product} key={fav.productId} />;
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Favorite;
