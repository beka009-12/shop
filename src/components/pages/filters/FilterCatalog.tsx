"use client";
import { FC, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import scss from "./FilterCatalog.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import { useGetCommodityProductsByCategoryCategoryId } from "@/api/generated/endpoints/product/product";
import { useGetCategoryCategoriesTree } from "@/api/generated/endpoints/category/category";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

const findCategory = (cats: Category[], id: number): Category | null => {
  for (const cat of cats) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategory(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

const plural = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return "товар";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "товара";
  return "товаров";
};

const SORT_OPTIONS = [
  { value: "default",    label: "Все" },
  { value: "price-asc",  label: "Дешевле" },
  { value: "price-desc", label: "Дороже" },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props { categoryId?: number; }

const FilterCatalog: FC<Props> = ({ categoryId }) => {
  const reduce = useReducedMotion();

  const { data, isLoading, isError } =
    useGetCommodityProductsByCategoryCategoryId(categoryId as number);

  const { data: catTree } = useGetCategoryCategoriesTree();

  const [sortBy, setSortBy]           = useState("default");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

  const category = useMemo(() => {
    if (!catTree?.categories || !categoryId) return null;
    return findCategory(catTree.categories as Category[], categoryId);
  }, [catTree, categoryId]);

  const brands = useMemo(() => {
    if (!data?.products) return [];
    const set = new Set(
      data.products.map((p) => p.brandName).filter(Boolean) as string[]
    );
    return Array.from(set).sort();
  }, [data?.products]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    let list = [...data.products];

    if (onlyDiscount)
      list = list.filter((p) => p.newPrice && p.price && p.newPrice < p.price);

    if (selectedBrands.size > 0)
      list = list.filter((p) => p.brandName && selectedBrands.has(p.brandName));

    switch (sortBy) {
      case "price-asc":
        return list.sort(
          (a, b) => (a.newPrice ?? a.price ?? 0) - (b.newPrice ?? b.price ?? 0)
        );
      case "price-desc":
        return list.sort(
          (a, b) => (b.newPrice ?? b.price ?? 0) - (a.newPrice ?? a.price ?? 0)
        );
      default:
        return list;
    }
  }, [data?.products, sortBy, onlyDiscount, selectedBrands]);

  const hasActiveFilters = onlyDiscount || selectedBrands.size > 0;
  const total = filteredProducts.length;

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });

  if (isError)
    return <div className={scss.error}>Ошибка загрузки товаров</div>;

  return (
    <div className={scss.FilterCatalog}>
      <div className="container">

        {/* ── Head ─────────────────────────────────────────────────────── */}
        <motion.div
          className={scss.head}
          initial={{ opacity: 0, y: reduce ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h1 className={scss.categoryName}>
            {category?.name ?? "Каталог"}
          </h1>
          <span className={scss.count}>
            {total} {plural(total)}
          </span>
        </motion.div>

        {/* ── Filter bar ───────────────────────────────────────────────── */}
        <motion.div
          className={scss.filterBar}
          initial={{ opacity: 0, y: reduce ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease, delay: 0.06 }}
        >
          {/* Sort segment */}
          <div className={scss.sortSegment}>
            {SORT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                className={`${scss.segBtn} ${sortBy === opt.value ? scss.segBtnActive : ""}`}
                onClick={() => setSortBy(opt.value)}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.12 }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>

          {/* Separator */}
          <div className={scss.sep} />

          {/* Discount chip */}
          <motion.button
            className={`${scss.chip} ${onlyDiscount ? scss.chipOn : ""}`}
            onClick={() => setOnlyDiscount((v) => !v)}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {onlyDiscount && (
                <motion.svg
                  key="check"
                  width="10" height="10"
                  viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.12 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              )}
            </AnimatePresence>
            Со скидкой
          </motion.button>

          {/* Brand chips */}
          {brands.map((brand) => {
            const active = selectedBrands.has(brand);
            return (
              <motion.button
                key={brand}
                className={`${scss.chip} ${active ? scss.chipOn : ""}`}
                onClick={() => toggleBrand(brand)}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.12 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {active && (
                    <motion.svg
                      key="check"
                      width="10" height="10"
                      viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.12 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </AnimatePresence>
                {brand}
              </motion.button>
            );
          })}

          {/* Clear */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                className={scss.clearBtn}
                onClick={() => {
                  setOnlyDiscount(false);
                  setSelectedBrands(new Set());
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.94 }}
              >
                Сбросить
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Grid (re-animates on filter change) ──────────────────────── */}
        <motion.div
          key={`${sortBy}-${onlyDiscount}-${[...selectedBrands].join(",")}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease }}
        >
          <Grid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default FilterCatalog;
