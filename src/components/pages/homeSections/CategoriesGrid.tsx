"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ["#3b1fa8", "#6d4af0"],
  ["#0d1b2a", "#1a3a5c"],
  ["#063a2a", "#0a7c5c"],
  ["#6b1a0a", "#c2390c"],
  ["#1a0e4b", "#3730a3"],
  ["#5c0b6b", "#a21caf"],
  ["#0a3d56", "#0369a1"],
  ["#3b1802", "#92400e"],
];

// Keyword → Unsplash photo URL (w=260&h=320)
const CATEGORY_IMAGES: [string, string][] = [
  ["одежда", "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=260&h=320&fit=crop&q=80"],
  ["платье", "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=260&h=320&fit=crop&q=80"],
  ["футбол", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=260&h=320&fit=crop&q=80"],
  ["электроник", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=260&h=320&fit=crop&q=80"],
  ["телефон", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=260&h=320&fit=crop&q=80"],
  ["ноутбук", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=260&h=320&fit=crop&q=80"],
  ["обувь", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=260&h=320&fit=crop&q=80"],
  ["кроссовк", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=260&h=320&fit=crop&q=80"],
  ["сумк", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=260&h=320&fit=crop&q=80"],
  ["аксессуар", "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=260&h=320&fit=crop&q=80"],
  ["спорт", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=260&h=320&fit=crop&q=80"],
  ["красот", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=260&h=320&fit=crop&q=80"],
  ["косметик", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=260&h=320&fit=crop&q=80"],
  ["парфюм", "https://images.unsplash.com/photo-1541643600914-78b084683702?w=260&h=320&fit=crop&q=80"],
  ["дом", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&h=320&fit=crop&q=80"],
  ["детск", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=260&h=320&fit=crop&q=80"],
  ["игрушк", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=260&h=320&fit=crop&q=80"],
  ["еда", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=260&h=320&fit=crop&q=80"],
  ["продукт", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=260&h=320&fit=crop&q=80"],
  ["книг", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=260&h=320&fit=crop&q=80"],
  ["мебел", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&h=320&fit=crop&q=80"],
  ["украшен", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=260&h=320&fit=crop&q=80"],
  // fallback — generic product shot
  ["", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=260&h=320&fit=crop&q=80"],
];

const getCategoryImage = (name: string): string => {
  const lower = name.toLowerCase();
  for (const [key, url] of CATEGORY_IMAGES) {
    if (key === "" || lower.includes(key)) return url;
  }
  return CATEGORY_IMAGES[CATEGORY_IMAGES.length - 1][1];
};

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
          const imgUrl = getCategoryImage(cat.name);
          const subCount = cat.children?.length ?? cat._count?.products ?? 0;

          return (
            <div
              key={cat.id}
              className={scss.card}
              style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
              onClick={() => router.push(`/catalog/${cat.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/catalog/${cat.id}`)}
            >
              {/* 3D pop-out image */}
              <div className={scss.imgWrap}>
                <Image
                  src={imgUrl}
                  alt={cat.name}
                  width={110}
                  height={130}
                  className={scss.img}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>

              {/* Bottom label */}
              <div className={scss.label}>
                <span className={scss.labelName}>{cat.name}</span>
                {subCount > 0 && (
                  <span className={scss.labelCount}>{subCount}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesGrid;
