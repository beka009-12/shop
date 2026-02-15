"use client";
import { type FC, memo } from "react";
import scss from "./Grid.module.scss";
import Cards from "../cards/Cards";
import CardSceleton from "../cards/CardSceleton";
import ProductsNot from "../noteF/productsNot";

interface ProductCard {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number | null;
}

interface GridProps {
  products?: ProductCard[];
  isLoading?: boolean;
  isError?: boolean;
}

const SKELETON_COUNT = 10;

const Grid: FC<GridProps> = ({
  products,
  isLoading = false,
  isError = false,
}) => {
  if (isLoading) {
    return (
      <div className={scss.Grid} aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <CardSceleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={scss.gridNot}>
        <ProductsNot type="empty" />
      </div>
    );
  }

  return (
    <div className={scss.Grid}>
      {products.map((card) => (
        <Cards key={card.id} {...card} />
      ))}
    </div>
  );
};

export default memo(Grid);
