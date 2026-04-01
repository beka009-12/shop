"use client";
import { type FC, useState, useRef, useMemo, useEffect } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cards/Grid";
import Search from "@/utils/ui/search/Search";
import { motion } from "framer-motion"; // Рекомендую для анимаций, но можно и без

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Популярные" },
];

const Welcome: FC = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const { data, isLoading, isError } = useGetProduct({ search });

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });

      // Скроллим к активной вкладке на мобилках
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    let items = [...data.products];

    switch (activeTab) {
      case "sale":
        items = items.filter((p) => p.newPrice && p.newPrice < p.price);
        break;
      case "new":
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        items = items.filter((p) => new Date(p.createdAt) >= monthAgo);
        break;
      case "popular":
        items = items.filter((p) => (p.store?.rating || 0) >= 4.5);
        break;
    }
    return items;
  }, [data?.products, activeTab]);

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.filters}>
            <div className={scss.tabsWrapper}>
              <div className={scss.tabs} ref={tabsRef}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    ref={activeTab === tab.id ? activeTabRef : null}
                    className={`${scss.tab} ${activeTab === tab.id ? scss.active : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
                <div
                  className={scss.indicator}
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                />
              </div>
            </div>

            <Search onSearch={setSearch} />
          </div>

          {filteredProducts.length === 0 && !isLoading ? (
            <div className={scss.emptyState}>
              <div style={{ fontSize: "48px" }}>🔍</div>
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить фильтр или параметры поиска</p>
              <button
                className={scss.resetBtn}
                onClick={() => {
                  setActiveTab("all");
                  setSearch("");
                }}
                aria-label="Сбросить фильтры и поиск"
              >
                Сбросить всё
              </button>
            </div>
          ) : (
            <Grid
              products={filteredProducts}
              isLoading={isLoading}
              isError={isError}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
