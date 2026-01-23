"use client";
import { type FC, memo } from "react";
import scss from "./Grid.module.scss";
import Cards from "../cards/Cards";
import CardSceleton from "../cards/CardSceleton";

interface ProductCard {
  id: number;
  storeId: number;
  categoryId: number;
  brandName?: string | null;
  title: string;
  description: string;
  images: string[];
  price: number;
  oldPrice?: number | null;
  stockCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
    logo?: string | null;
    isVerified: boolean;
    rating?: number | null;
  };
}

interface GridProps {
  products?: ProductCard[];
  isLoading?: boolean;
}

const SKELETON_COUNT = 10;

const Grid: FC<GridProps> = ({ products, isLoading = false }) => {
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
      <div className={scss.Grid}>
        <p className={scss.emptyState}>
          Товары не найдены. Попробуйте изменить фильтры.
        </p>
      </div>
    );
  }

  // 3️⃣ Есть товары
  return (
    <div className={scss.Grid}>
      {products.map((card) => (
        <Cards key={card.id} {...card} />
      ))}
    </div>
  );
};

export default memo(Grid);
