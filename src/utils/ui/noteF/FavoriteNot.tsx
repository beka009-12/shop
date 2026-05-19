"use client";
import { type FC } from "react";
import scss from "./OrderNot.module.scss";
import { useRouter } from "next/navigation";
import { Btn } from "../GlobalBtn/Btn";

const FavoriteNot: FC = () => {
  const router = useRouter();

  return (
    <div className={scss.notFound}>
      <div className={scss.iconWrap}>
        <div className={scss.iconRing} />
        <div className={scss.iconBox}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
      </div>
      <h2 className={scss.heading}>Здесь пока пусто</h2>
      <p className={scss.sub}>Добавляйте товары в избранное, чтобы не потерять</p>
      <Btn onClick={() => router.push("/")} title="Перейти в каталог" />
    </div>
  );
};

export default FavoriteNot;
