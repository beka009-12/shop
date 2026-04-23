"use client";
import {
  type FC,
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import scss from "./Welcome.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import useSearch from "@/api/search";

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Популярные" },
];

const Welcome: FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const tabsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Теперь запрашиваем данные без параметра search, так как мы его убрали
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSearch({
    limit: 20,
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
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const filteredProducts = useMemo(() => {
    const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
    switch (activeTab) {
      case "sale":
        return allProducts.filter((p) => p.newPrice && p.newPrice < p.price);
      case "new": {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return allProducts.filter((p) => new Date(p.createdAt) >= monthAgo);
      }
      case "popular":
        return allProducts.filter((p) => Number(p.store?.rating ?? 0) >= 4.5);
      default:
        return allProducts;
    }
  }, [data?.pages, activeTab]);

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.filterBar}>
            <div className={scss.tabs} ref={tabsRef}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`${scss.tab} ${activeTab === tab.id ? scss.active : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Сюда в будущем можно добавить кнопку "Фильтры" с иконкой */}
          </div>

          {filteredProducts.length === 0 && !isLoading ? (
            <div className={scss.emptyState}>
              <h3>В этой категории пока пусто</h3>
              <button onClick={() => setActiveTab("all")}>
                Вернуться ко всем товарам
              </button>
            </div>
          ) : (
            <>
              <Grid
                products={filteredProducts}
                isLoading={isLoading}
                isError={isError}
              />
              <div ref={sentinelRef} style={{ height: "20px" }} />
              {isFetchingNextPage && (
                <div className={scss.loader}>Загрузка...</div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
