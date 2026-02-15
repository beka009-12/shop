"use client";
import { type FC, useState, useRef, useMemo } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cards/Grid";
import Search from "@/utils/ui/search/Search";

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Популярные" },
];

const Welcome: FC = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const { data, isLoading, isError } = useGetProduct({
    search: search,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    const products = data.products;

    switch (activeTab) {
      case "sale":
        return products.filter(
          (product) => product.oldPrice && product.oldPrice < product.price,
        );

      case "new":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return products.filter(
          (product) => new Date(product.createdAt) >= thirtyDaysAgo,
        );

      case "popular":
        return products
          .filter(
            (product) =>
              product.store &&
              product.store.rating &&
              product.store.rating >= 4.5,
          )
          .sort((a, b) => {
            const ratingA = a.store?.rating || 0;
            const ratingB = b.store?.rating || 0;
            return ratingB - ratingA;
          });

      case "all":
      default:
        return products;
    }
  }, [data?.products, activeTab]);

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.filters}>
            <div className={scss.tabs} ref={tabsRef}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`${scss.tab} ${
                    activeTab === tab.id ? scss.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Search onSearch={handleSearch} />
          </div>

          <Grid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
