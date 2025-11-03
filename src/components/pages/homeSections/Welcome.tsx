"use client";
import { type FC } from "react";
import scss from "./Welcome.module.scss";
import Grid from "../../../../ui/cardGrid/Grid";
import { useGetProduct } from "@/api/product";

const Welcome: FC = () => {
  const { data: product } = useGetProduct();

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <Grid cards={product} />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
