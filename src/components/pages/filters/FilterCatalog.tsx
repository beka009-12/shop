"use client";
import { FC, useState, useMemo } from "react";
import scss from "./FilterCatalog.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import { useGetCommodityProductsByCategoryCategoryId } from "@/api/generated/endpoints/product/product";

interface Props {
  categoryId?: number;
}

const SORT_OPTIONS = [
  { value: "default",    label: "По умолчанию" },
  { value: "price-asc",  label: "Дешевле" },
  { value: "price-desc", label: "Дороже" },
];

const FilterCatalog: FC<Props> = ({ categoryId }) => {
  const { data, isLoading, isError } =
    useGetCommodityProductsByCategoryCategoryId(categoryId as number);

  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    const products = [...data.products];
    switch (sortBy) {
      case "price-asc":
        return products.sort(
          (a, b) => (a.price ?? 0) - (b.newPrice ?? b.price ?? 0),
        );
      case "price-desc":
        return products.sort(
          (a, b) => (b.newPrice ?? b.price ?? 0) - (a.price ?? 0),
        );
      default:
        return products;
    }
  }, [data?.products, sortBy]);

  if (isError) return <div className={scss.error}>Ошибка загрузки товаров</div>;

  const total = data?.pagination?.total ?? 0;

  return (
    <div className={scss.FilterCatalog}>
      <div className="container">

        {/* ── Head bar ── */}
        <div className={scss.head}>
          <div className={scss.countBlock}>
            <span className={scss.countNum}>{total}</span>
            <span className={scss.countLabel}>товаров</span>
          </div>

          <div className={scss.sortGroup}>
            <span className={scss.sortLabel}>Сортировка</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${scss.sortBtn} ${sortBy === opt.value ? scss.sortBtnActive : ""}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Layout ── */}
        <div className={scss.layout}>
          <aside className={scss.aside}>
            <div className={scss.filterSection}>
              <p className={scss.filterSectionTitle}>Цена</p>
              <div className={scss.priceHint}>Используйте сортировку выше</div>
            </div>

            <div className={scss.filterSection}>
              <p className={scss.filterSectionTitle}>Наличие</p>
              <label className={scss.checkLabel}>
                <input type="checkbox" className={scss.check} />
                <span className={scss.checkMark} />
                В наличии
              </label>
              <label className={scss.checkLabel}>
                <input type="checkbox" className={scss.check} />
                <span className={scss.checkMark} />
                Со скидкой
              </label>
            </div>

            <div className={scss.filterSection}>
              <p className={scss.filterSectionTitle}>Бренды</p>
              {["Nike", "Adidas", "Puma", "New Balance"].map((brand) => (
                <label key={brand} className={scss.checkLabel}>
                  <input type="checkbox" className={scss.check} />
                  <span className={scss.checkMark} />
                  {brand}
                </label>
              ))}
            </div>
          </aside>

          <div className={scss.main}>
            <Grid
              products={sortedProducts}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterCatalog;
