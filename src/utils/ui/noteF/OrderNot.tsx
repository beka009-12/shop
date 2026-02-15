"use client";
import { type FC } from "react";
import scss from "./OrderNot.module.scss";
import NotFound from "../../../../public/notFound.png";
import { useRouter } from "next/navigation";
import { Btn } from "../GlobalBtn/Btn";

const OrderNot: FC = () => {
  const router = useRouter();

  const handleHomeRedirect = () => {
    router.push("/");
  };
  return (
    <div className={scss.notFound}>
      <img src={NotFound.src} alt="Корзина пуста" />
      <h2>Корзина пуста</h2>
      <p>Добавьте товары, чтобы оформить заказ</p>
      <Btn onClick={handleHomeRedirect} title="Перейти в главное" />
    </div>
  );
};

export default OrderNot;
