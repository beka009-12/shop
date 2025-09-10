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
      images: [
        "https://basket-15.wbbasket.ru/vol2374/part237489/237489274/images/big/1.webp",
      ],
      price: 12000,
      newPrice: 9500,
      sale: true,
    },
    {
      id: 2,
      shopId: 102,
      title: "Adidas Ultraboost",
      images: [
        "https://media.karousell.com/media/photos/products/2023/2/26/adidas_ultraboost_4d_grey_blac_1677395837_95ef70cb_progressive.jpg",
      ],
      price: 13500,
      newPrice: 11000,
      sale: true,
    },
    {
      id: 3,
      shopId: 103,
      title: "Puma RS-X",
      images: [
        "https://basket-17.wbbasket.ru/vol2623/part262386/262386798/images/big/1.webp",
      ],
      price: 10500,
      newPrice: 8900,
      sale: false,
    },
    {
      id: 4,
      shopId: 104,
      title: "New Balance 574",
      images: ["https://ir.ozone.ru/s3/multimedia-9/c1000/6727815081.jpg"],
      price: 9800,
      newPrice: 7800,
      sale: true,
    },
  ];

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
