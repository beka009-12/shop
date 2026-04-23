"use client";
import { FC, useState, useMemo } from "react";
import scss from "./FilterCatalog.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import { useGetCommodityProductsByCategoryCategoryId } from "@/api/generated/endpoints/product/product";

interface Props {
  categoryId?: number;
}

const FilterCatalog: FC<Props> = ({ categoryId }) => {
  // Исправил синтаксическую ошибку с categoryId?
  const { data, isLoading, isError } =
    useGetCommodityProductsByCategoryCategoryId(categoryId as number);

  const [sortBy, setSortBy] = useState("default");

  // Сортировка на стороне клиента (для примера)
  const sortedProducts = useMemo(() => {
    if (!data?.products) return [];
    const products = [...data.products];

    switch (sortBy) {
      case "price-asc":
        return products.sort(
          (a, b) =>
            (a.price ? a.price : 0) -
            (b.newPrice ? b.newPrice : b.price ? b.price : 0),
        );
      case "price-desc":
        return products.sort(
          (a, b) =>
            (b.newPrice ? b.newPrice : b.price ? b.price : 0) -
            (a.price ? a.price : 0),
        );
      default:
        return products;
    }
  }, [data?.products, sortBy]);

  if (isError) return <div className={scss.error}>Ошибка загрузки товаров</div>;

  return (
    <div className={scss.FilterCatalog}>
      <div className="container">
        {/* Заголовок категории и количество */}
        <div className={scss.head}>
          <div className={scss.categoryTitle}>
            <span>Найдено {data?.pagination?.total || 0} товаров</span>
          </div>

          <div className={scss.controls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={scss.select}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевые</option>
              <option value="price-desc">Сначала дорогие</option>
            </select>
          </div>
        </div>

        <div className={scss.layout}>
          {/* Можно добавить Aside для более сложных фильтров */}
          <aside className={scss.aside}>
            <div className={scss.filterGroup}>
              <h4>Бренды</h4>
              {/* Здесь можно мапить уникальные бренды из массива товаров */}
              <label>
                <input type="checkbox" /> Nike
              </label>
              <label>
                <input type="checkbox" /> Adidas
              </label>
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
