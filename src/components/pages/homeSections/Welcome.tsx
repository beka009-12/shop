"use client";
import { type FC } from "react";
import scss from "./Welcome.module.scss";
import Grid from "../../../../ui/cardGrid/Grid";

const Welcome: FC = () => {
  const content = [
    {
      id: 1,
      shopId: 101,
      title: "Nike Air Max 270",
      image: ["https://via.placeholder.com/300x200.png?text=Nike+Air+Max+270"],
      price: 12000,
      newPrice: 9500,
      sale: true,
    },
    {
      id: 2,
      shopId: 102,
      title: "Adidas Ultraboost",
      image: ["https://via.placeholder.com/300x200.png?text=Adidas+Ultraboost"],
      price: 13500,
      newPrice: 11000,
      sale: true,
    },
    {
      id: 3,
      shopId: 103,
      title: "Puma RS-X",
      image: ["https://via.placeholder.com/300x200.png?text=Puma+RS-X"],
      price: 10500,
      newPrice: 8900,
      sale: false,
    },
    {
      id: 4,
      shopId: 104,
      title: "New Balance 574",
      image: ["https://via.placeholder.com/300x200.png?text=New+Balance+574"],
      price: 9800,
      newPrice: 7800,
      sale: true,
    },
  ];

  console.log("Google Client ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <Grid cards={content} />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
