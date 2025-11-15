"use client";
import { type FC } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cardGrid/Grid";

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
