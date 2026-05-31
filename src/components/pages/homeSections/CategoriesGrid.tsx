"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import scss from "./CategoriesGrid.module.scss";
import { useGetCategoryCategoriesTree } from "@/api/generated/endpoints/category/category";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children?: Category[];
  _count?: { products: number };
}

const PALETTE: [string, string][] = [
  ["#5533EB", "#7c5ff5"],
  ["#0f172a", "#1e3a5f"],
  ["#064e3b", "#059669"],
  ["#7c2d12", "#c2410c"],
  ["#1e1b4b", "#4338ca"],
  ["#701a75", "#a21caf"],
  ["#0c4a6e", "#0284c7"],
  ["#422006", "#92400e"],
];

const CategoriesGrid: FC = () => {
  const router = useRouter();
  const { data, isPending } = useGetCategoryCategoriesTree();

  const roots = ((data?.categories ?? []) as Category[]).filter(
    (c) => c.id !== undefined && c.parentId === null,
  );

  if (isPending) {
    return (
      <div className={scss.section}>
        <h2 className={scss.title}>Категории</h2>
        <div className={scss.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={scss.skTile} />
          ))}
        </div>
      </div>
    );
  }

  if (roots.length === 0) return null;

  return (
    <div className={scss.section}>
      <h2 className={scss.title}>Категории</h2>
      <div className={scss.grid}>
        {roots.map((cat, i) => {
          const [from, to] = PALETTE[i % PALETTE.length];
          const subCount = cat.children?.length ?? cat._count?.products ?? 0;
          return (
            <div
              key={cat.id}
              className={scss.tile}
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              onClick={() => router.push(`/catalog/${cat.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/catalog/${cat.id}`)}
            >
              <span className={scss.tileName}>{cat.name}</span>
              {subCount > 0 && (
                <span className={scss.tileCount}>
                  {cat.children?.length
                    ? `${subCount} подкатегорий`
                    : `${subCount} товаров`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesGrid;
