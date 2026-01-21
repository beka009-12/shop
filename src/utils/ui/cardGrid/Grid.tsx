// Grid.tsx
"use client";
import { type FC } from "react";
import scss from "./Grid.module.scss";
import Cards from "../cards/Cards";

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
}

const Grid: FC<GridProps> = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className={scss.empty}>
        <p>Товары не найдены</p>
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

export default Grid;
