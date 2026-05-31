# Homepage UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the filter sidebar, add a dock-style Spotlight search, fix mobile nav by adding Магазины, and redesign the homepage to show Shops → Categories (gradient tiles) → Products.

**Architecture:** Welcome.tsx is split into three standalone section components (ShopsRow, CategoriesGrid, ProductsGrid). DockSearch is a new Layout-level component fixed at bottom-center on desktop. Mobile.tsx swaps one nav item. No new API hooks — all data comes from existing generated hooks.

**Tech Stack:** Next.js 15 App Router, React 19, CSS Modules + SCSS, TanStack Query v5, Orval-generated hooks.

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/components/pages/homeSections/Welcome.tsx` |
| Modify | `src/components/pages/homeSections/Welcome.module.scss` |
| Create | `src/components/pages/homeSections/ShopsRow.tsx` |
| Create | `src/components/pages/homeSections/ShopsRow.module.scss` |
| Create | `src/components/pages/homeSections/CategoriesGrid.tsx` |
| Create | `src/components/pages/homeSections/CategoriesGrid.module.scss` |
| Create | `src/components/layout/dockSearch/DockSearch.tsx` |
| Create | `src/components/layout/dockSearch/DockSearch.module.scss` |
| Modify | `src/components/layout/Layout.tsx` |
| Modify | `src/components/layout/header/Header.tsx` |
| Modify | `src/components/layout/mobileNavigation/Mobile.tsx` |

---

## Task 1: Create ShopsRow component

**Files:**
- Create: `src/components/pages/homeSections/ShopsRow.tsx`
- Create: `src/components/pages/homeSections/ShopsRow.module.scss`

- [ ] **Step 1: Create ShopsRow.module.scss**

```scss
// src/components/pages/homeSections/ShopsRow.module.scss
.section {
  padding: 28px 0 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.viewAll {
  font-size: 12px;
  color: #5533EB;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

.scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.card {
  flex-shrink: 0;
  width: 130px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

.cover {
  height: 70px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.verified {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 8px;
  color: #0f6e56;
  background: rgba(225, 245, 238, 0.92);
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.logoWrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid #fff;
  overflow: hidden;
  background: #f5f5f3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.logoIni {
  width: 100%;
  height: 100%;
  background: #374151;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
}

.body {
  padding: 8px 10px;
}

.shopName {
  font-size: 11px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  font-size: 9px;
  color: #9ca3af;
}

// Skeleton
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skCard {
  flex-shrink: 0;
  width: 130px;
  height: 118px;
  border-radius: 14px;
  background: linear-gradient(90deg, #ebebeb 25%, #f5f5f5 50%, #ebebeb 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
```

- [ ] **Step 2: Create ShopsRow.tsx**

```tsx
// src/components/pages/homeSections/ShopsRow.tsx
"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import scss from "./ShopsRow.module.scss";
import { useGetShops } from "@/api/generated/endpoints/shops/shops";
import { ShopSummary } from "@/api/generated/models";

const MAX_SHOPS = 8;

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ShopsRow: FC = () => {
  const router = useRouter();
  const { data, isPending } = useGetShops();
  const shops = ((data?.shops ?? []) as ShopSummary[]).slice(0, MAX_SHOPS);

  return (
    <div className={scss.section}>
      <div className={scss.header}>
        <h2 className={scss.title}>Магазины</h2>
        <button className={scss.viewAll} onClick={() => router.push("/shops")}>
          Все магазины →
        </button>
      </div>

      <div className={scss.scroll}>
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={scss.skCard} />
            ))
          : shops.map((store) => (
              <div
                key={store.id}
                className={scss.card}
                onClick={() => router.push(`/shops/${store.id}`)}
              >
                <div className={scss.cover}>
                  {store.isVerified && (
                    <span className={scss.verified}>✓ Проверен</span>
                  )}
                  <div className={scss.logoWrap}>
                    {store.logo ? (
                      <img src={store.logo} alt={store.name ?? ""} />
                    ) : (
                      <div className={scss.logoIni}>
                        {getInitials(store.name ?? "")}
                      </div>
                    )}
                  </div>
                </div>
                <div className={scss.body}>
                  <p className={scss.shopName}>{store.name}</p>
                  <p className={scss.meta}>
                    {store.rating ? `⭐ ${store.rating}` : ""}
                    {store.rating && store._count?.products ? " · " : ""}
                    {store._count?.products
                      ? `${store._count.products} товаров`
                      : ""}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ShopsRow;
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "ShopsRow\|error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/homeSections/ShopsRow.tsx src/components/pages/homeSections/ShopsRow.module.scss
git commit -m "feat: add ShopsRow section component for homepage"
```

---

## Task 2: Create CategoriesGrid component

**Files:**
- Create: `src/components/pages/homeSections/CategoriesGrid.tsx`
- Create: `src/components/pages/homeSections/CategoriesGrid.module.scss`

- [ ] **Step 1: Create CategoriesGrid.module.scss**

```scss
// src/components/pages/homeSections/CategoriesGrid.module.scss
.section {
  padding: 24px 0 0;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 14px;
  letter-spacing: -0.02em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tile {
  border-radius: 14px;
  padding: 18px 16px;
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  }
}

.tileName {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  position: relative;
  z-index: 1;
  line-height: 1.3;
}

.tileCount {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 1;
}

// Skeleton
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skTile {
  border-radius: 14px;
  min-height: 88px;
  background: linear-gradient(90deg, #ddd 25%, #eee 50%, #ddd 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
```

- [ ] **Step 2: Create CategoriesGrid.tsx**

```tsx
// src/components/pages/homeSections/CategoriesGrid.tsx
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
```

- [ ] **Step 3: Lint check**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "CategoriesGrid\|error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/homeSections/CategoriesGrid.tsx src/components/pages/homeSections/CategoriesGrid.module.scss
git commit -m "feat: add CategoriesGrid section with gradient palette tiles"
```

---

## Task 3: Refactor Welcome.tsx — remove filters, add sections

**Files:**
- Modify: `src/components/pages/homeSections/Welcome.tsx`
- Modify: `src/components/pages/homeSections/Welcome.module.scss`

- [ ] **Step 1: Replace Welcome.tsx**

```tsx
// src/components/pages/homeSections/Welcome.tsx
"use client";
import { type FC, useState, useRef, useEffect, useCallback } from "react";
import scss from "./Welcome.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import ShopsRow from "./ShopsRow";
import CategoriesGrid from "./CategoriesGrid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommodityProductsInfinite } from "@/api/generated/endpoints/product/product";
import type {
  GetCommodityProductsInfiniteSort,
} from "@/api/generated/models";

const SORT_OPTIONS: Array<{ value: GetCommodityProductsInfiniteSort; label: string }> = [
  { value: "newest", label: "Новинки" },
  { value: "popular", label: "Популярные" },
  { value: "price_asc", label: "Дешевле" },
  { value: "price_desc", label: "Дороже" },
];

const Welcome: FC = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<GetCommodityProductsInfiniteSort>("newest");

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["products-infinite", { sort }],
      queryFn: ({ pageParam }) =>
        getCommodityProductsInfinite({
          cursor: pageParam as number | undefined,
          limit: 20,
          sort,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
      staleTime: 1000 * 30,
    });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allProducts = data?.pages.flatMap((p) => p.products ?? []) ?? [];

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <ShopsRow />
        <div className={scss.divider} />
        <CategoriesGrid />
        <div className={scss.divider} />

        {/* Sort bar */}
        <div className={scss.sortBar}>
          <h2 className={scss.sectionTitle}>Новинки</h2>
          <div className={scss.sortBtns}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${scss.sortBtn} ${sort === opt.value ? scss.sortBtnActive : ""}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Full-width product grid */}
        <Grid products={allProducts} isLoading={isLoading} isError={isError} />
        <div ref={sentinelRef} style={{ height: "20px" }} />
        {isFetchingNextPage && <div className={scss.loader}>Загрузка...</div>}
      </div>
    </section>
  );
};

export default Welcome;
```

- [ ] **Step 2: Replace Welcome.module.scss**

```scss
// src/components/pages/homeSections/Welcome.module.scss
$accent:  #5533eb;
$text:    #18180f;
$border:  #ebebeb;
$bg-page: #f7f7f6;

.Welcome {
  padding: 20px 0 80px;
  background: $bg-page;
  min-height: 80vh;
}

.divider {
  border-top: 1px solid $border;
  margin: 28px 0;
}

.sectionTitle {
  font-size: 16px;
  font-weight: 600;
  color: $text;
  margin: 0;
  letter-spacing: -0.02em;
}

// ── Sort bar ──────────────────────────────────────────────────────────────────
.sortBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.sortBtns {
  display: flex;
  gap: 6px;
  background: #fff;
  border: 1.5px solid $border;
  border-radius: 40px;
  padding: 4px 5px;
}

.sortBtn {
  padding: 6px 14px;
  border-radius: 30px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 400;
  color: #555;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;

  &:hover:not(.sortBtnActive) {
    background: #f2f2f1;
    color: $text;
  }
}

.sortBtnActive {
  background: $text;
  color: #fff;
  font-weight: 500;
}

// ── Loader ────────────────────────────────────────────────────────────────────
.loader {
  text-align: center;
  padding: 20px 0;
  font-size: 13px;
  color: #aaa;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 3: Lint check**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "Welcome\|error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/homeSections/Welcome.tsx src/components/pages/homeSections/Welcome.module.scss
git commit -m "refactor: replace filter sidebar with shops+categories sections on homepage"
```

---

## Task 4: Create DockSearch component

**Files:**
- Create: `src/components/layout/dockSearch/DockSearch.tsx`
- Create: `src/components/layout/dockSearch/DockSearch.module.scss`

- [ ] **Step 1: Create DockSearch.module.scss**

```scss
// src/components/layout/dockSearch/DockSearch.module.scss
$accent: #5533eb;

// ── Pill (closed state) ───────────────────────────────────────────────────────
.pill {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  padding: 8px 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
    transform: translateX(-50%) translateY(-1px);
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.pillIcon {
  width: 28px;
  height: 28px;
  background: $accent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pillText {
  font-size: 12px;
  color: #9ca3af;
}

.pillShortcut {
  font-size: 10px;
  color: #d1d5db;
  background: #f3f4f6;
  padding: 2px 7px;
  border-radius: 5px;
  letter-spacing: 0.02em;
}

// ── Overlay (open state) ──────────────────────────────────────────────────────
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 15, 25, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  animation: fadeIn 0.18s ease;

  @media (max-width: 768px) {
    display: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 480px;
  max-width: calc(100vw - 48px);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
  animation: slideDown 0.18s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.inputRow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #f0f0f0;
}

.inputIcon {
  flex-shrink: 0;
  color: $accent;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111827;
  background: transparent;

  &::placeholder {
    color: #9ca3af;
  }
}

.escHint {
  font-size: 10px;
  color: #aaa;
  background: #f5f5f5;
  padding: 2px 7px;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

// ── Results ───────────────────────────────────────────────────────────────────
.results {
  max-height: 340px;
  overflow-y: auto;
  padding: 6px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
}

.resultsLabel {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
  padding: 6px 10px 4px;
}

.resultItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f5f3ff;
  }
}

.resultImg {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  background: #f5f4f8;
  flex-shrink: 0;
}

.resultImgPlaceholder {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #ede9ff;
  flex-shrink: 0;
}

.resultName {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resultPrice {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

.empty {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
}
```

- [ ] **Step 2: Create DockSearch.tsx**

```tsx
// src/components/layout/dockSearch/DockSearch.tsx
"use client";
import { type FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import scss from "./DockSearch.module.scss";
import { useGetSearchProducts } from "@/api/generated/endpoints/search/search";
import { Product } from "@/api/generated/models";

const SearchIcon: FC<{ size?: number; color?: string }> = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const DockSearch: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useGetSearchProducts(
    { search: query, page: 1 },
    { query: { enabled: query.length >= 2, staleTime: 1000 * 10 } },
  );

  const products: Product[] = data?.products ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 60);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const goToProduct = (id: number) => {
    close();
    router.push(`/product/${id}`);
  };

  return (
    <>
      {/* Pill */}
      <button className={scss.pill} onClick={() => setIsOpen(true)} aria-label="Поиск">
        <span className={scss.pillIcon}>
          <SearchIcon size={13} color="#fff" />
        </span>
        <span className={scss.pillText}>Поиск товаров</span>
        <span className={scss.pillShortcut}>⌘K</span>
      </button>

      {/* Spotlight overlay */}
      {isOpen && (
        <div className={scss.overlay} onClick={close}>
          <div className={scss.modal} onClick={(e) => e.stopPropagation()}>
            <div className={scss.inputRow}>
              <span className={scss.inputIcon}>
                <SearchIcon size={16} color="#5533EB" />
              </span>
              <input
                ref={inputRef}
                className={scss.input}
                placeholder="Поиск товаров..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    close();
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
              />
              <span className={scss.escHint} onClick={close}>ESC</span>
            </div>

            {query.length >= 2 && (
              <div className={scss.results}>
                {products.length === 0 ? (
                  <p className={scss.empty}>Ничего не найдено</p>
                ) : (
                  <>
                    <p className={scss.resultsLabel}>Результаты</p>
                    {products.slice(0, 6).map((p) => {
                      const imgUrl = p.productImages?.[0]?.url;
                      return (
                        <div
                          key={p.id}
                          className={scss.resultItem}
                          onClick={() => goToProduct(p.id!)}
                        >
                          {imgUrl ? (
                            <img src={imgUrl} alt={p.title ?? ""} className={scss.resultImg} />
                          ) : (
                            <div className={scss.resultImgPlaceholder} />
                          )}
                          <div>
                            <p className={scss.resultName}>{p.title}</p>
                            <p className={scss.resultPrice}>
                              {p.newPrice ?? p.price} сом
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DockSearch;
```

- [ ] **Step 3: Lint check**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "DockSearch\|error" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/dockSearch/DockSearch.tsx src/components/layout/dockSearch/DockSearch.module.scss
git commit -m "feat: add DockSearch component — pill + spotlight overlay with CMD+K"
```

---

## Task 5: Wire DockSearch into Layout + remove search from Header

**Files:**
- Modify: `src/components/layout/Layout.tsx`
- Modify: `src/components/layout/header/Header.tsx`

- [ ] **Step 1: Add DockSearch to Layout.tsx**

```tsx
// src/components/layout/Layout.tsx
import { type FC, ReactNode } from "react";
import scss from "./Layout.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Mobile from "./mobileNavigation/Mobile";
import DockSearch from "./dockSearch/DockSearch";

interface ILay {
  children: ReactNode;
}

const Layout: FC<ILay> = ({ children }) => {
  return (
    <div className={scss.Layout}>
      <Header />
      <main>
        <div className={scss.card}>
          {children}
          <Footer />
        </div>
      </main>
      <Mobile />
      <DockSearch />
    </div>
  );
};

export default Layout;
```

- [ ] **Step 2: Remove Search from Header navItems**

In `src/components/layout/header/Header.tsx`, remove the search entry from the `navItems` array.

Find this block (around line 128):
```tsx
{ icon: <SearchIcon />, path: "/search", label: "Поиск" },
```
Delete that line entirely. The `SearchIcon` component definition above can stay (or be removed too — it's no longer used).

The navItems array should go from 6 items to 5:
```tsx
const navItems = [
  { icon: <HomeIcon />, path: "/", label: "Главная" },
  {
    icon: <CatalogIcon />,
    path: null,
    label: "Каталог",
    onClick: () => setIsCatalogOpen(true),
  },
  { icon: <CartIcon />, path: "/cart", label: "Корзина", count: cartCount },
  { icon: <ShopIcon />, path: "/shops", label: "Магазины" },
  {
    icon: <HeartIcon />,
    path: "/favorites",
    label: "Избранное",
    count: favCount,
  },
];
```

- [ ] **Step 3: Lint check**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "error\|warn" | head -20
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Layout.tsx src/components/layout/header/Header.tsx
git commit -m "feat: wire DockSearch into layout, remove search from sidebar nav"
```

---

## Task 6: Fix mobile navigation — add Магазины

**Files:**
- Modify: `src/components/layout/mobileNavigation/Mobile.tsx`

- [ ] **Step 1: Replace Избранное with Магазины in Mobile.tsx**

Find the Избранное block (around lines 114–139):
```tsx
{/* Избранное */}
<div
  onClick={() => navigateAndCloseProfile("/favorites")}
  className={clsx(
    scss.cartLink,
    isActive("/favorites") && scss.active,
  )}
>
  <svg ... />
  <span className={scss.cartCount}>
    {favorite?.favorites?.length || 0}
  </span>
</div>
```

Replace it with:
```tsx
{/* Магазины */}
<div
  onClick={() => navigateAndCloseProfile("/shops")}
  className={clsx(scss.cartLink, isActive("/shops") && scss.active)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.5"
    stroke="currentColor"
    className={scss.cartIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
    />
  </svg>
</div>
```

Also remove the unused `favorite` import if it's no longer used elsewhere in the file:
```tsx
// Remove this line if useGetFavoriteFavorites is no longer used:
const { data: favorite } = useGetFavoriteFavorites();
```

- [ ] **Step 2: Lint check**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun run lint 2>&1 | grep -i "Mobile\|error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/mobileNavigation/Mobile.tsx
git commit -m "fix: replace Избранное with Магазины in mobile bottom navigation"
```

---

## Task 7: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd /Users/bekbol/Desktop/marketplace/shop && bun dev
```

- [ ] **Step 2: Check homepage (localhost:3000)**

Verify in browser:
- Banner unchanged
- Shops horizontal scroll appears below banner (real shop cards or skeletons)
- Category gradient tiles appear below shops
- Product grid below categories — full width, no sidebar
- Sort tabs (Новинки/Популярные/etc.) above product grid

- [ ] **Step 3: Check DockSearch (desktop, >768px)**

- Pill visible at bottom center above mobile nav area
- Click pill → spotlight overlay opens
- Type 2+ characters → live results appear
- Press Enter → navigate to /search?q=...
- Click result → navigate to /product/:id
- Press Escape → closes
- Press Cmd+K → opens

- [ ] **Step 4: Check mobile nav (<768px)**

- DockSearch pill hidden
- Bottom nav shows: Дом · Корзина · Каталог · Магазины · Профиль
- Tapping Магазины → navigates to /shops

- [ ] **Step 5: Check desktop sidebar nav**

- Search icon no longer in left sidebar
- Remaining items: Главная · Каталог · Корзина · Магазины · Избранное

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: homepage ux redesign complete"
```
