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
import Search from "@/utils/ui/search/Search";
import useDebounce from "@/hooks/useDebounce";
import useSearch from "@/api/search";

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Популярные" },
];

const Welcome: FC = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null); // элемент-триггер внизу списка

  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSearch({
    search: debouncedSearch,
    limit: 20,
  });

  // IntersectionObserver — следит за sentinel-элементом внизу
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "2px", // начинаем грузить за 200px до конца списка
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  // Склеиваем все страницы в один массив, потом фильтруем по вкладке
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

  const handleReset = () => {
    setActiveTab("all");
    setSearch("");
  };

  const isEmpty = filteredProducts.length === 0 && !isLoading;

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
                <div className={scss.indicator} style={indicatorStyle} />
              </div>
            </div>

            <Search value={search} onSearch={setSearch} />
          </div>

          {isEmpty ? (
            <div className={scss.emptyState}>
              <div style={{ fontSize: "48px" }}>🔍</div>
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить фильтр или параметры поиска</p>
              <button
                className={scss.resetBtn}
                onClick={handleReset}
                aria-label="Сбросить фильтры и поиск"
              >
                Сбросить всё
              </button>
            </div>
          ) : (
            <>
              <Grid
                products={filteredProducts}
                isLoading={isLoading}
                isError={isError}
              />

              {isFetchingNextPage && (
                <div className={scss.skeletonGrid}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={scss.skeletonCard} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
