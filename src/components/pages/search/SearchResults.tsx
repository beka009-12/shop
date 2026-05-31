"use client";
import { FC, useState, useRef, useEffect, useCallback } from "react";
import scss from "./SearchResults.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchProducts } from "@/api/generated/endpoints/search/search";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  GetSearchProductsGender,
  GetSearchProductsSeason,
  GetSearchProductsSortBy,
  GetSearchProductsSortOrder,
} from "@/api/generated/models";

const SORT_OPTIONS: Array<{
  sortBy: GetSearchProductsSortBy;
  sortOrder: GetSearchProductsSortOrder;
  label: string;
}> = [
  { sortBy: "createdAt", sortOrder: "desc", label: "Новинки" },
  { sortBy: "soldCount", sortOrder: "desc", label: "Популярные" },
  { sortBy: "price", sortOrder: "asc", label: "Дешевле" },
  { sortBy: "price", sortOrder: "desc", label: "Дороже" },
];

const GENDER_OPTIONS: Array<{ value: GetSearchProductsGender; label: string }> = [
  { value: "MALE", label: "Мужское" },
  { value: "FEMALE", label: "Женское" },
  { value: "UNISEX", label: "Унисекс" },
];

const SEASON_OPTIONS: Array<{ value: GetSearchProductsSeason; label: string }> = [
  { value: "SPRING_SUMMER", label: "Весна / лето" },
  { value: "AUTUMN_WINTER", label: "Осень / зима" },
  { value: "ALL_SEASON", label: "Всесезонный" },
];

interface Filters {
  sortBy: GetSearchProductsSortBy;
  sortOrder: GetSearchProductsSortOrder;
  gender?: GetSearchProductsGender;
  season?: GetSearchProductsSeason;
  minPrice?: number;
  maxPrice?: number;
  brandName?: string;
}

const SearchResults: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [filters, setFilters] = useState<Filters>({ sortBy: "createdAt", sortOrder: "desc" });
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const activeSortIdx = SORT_OPTIONS.findIndex(
    (o) => o.sortBy === filters.sortBy && o.sortOrder === filters.sortOrder,
  );

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["search-products", query, filters],
      queryFn: ({ pageParam = 1 }) =>
        getSearchProducts({
          search: query || undefined,
          page: pageParam as number,
          limit: 20,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          gender: filters.gender,
          season: filters.season,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          brandName: filters.brandName || undefined,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination?.hasNextPage
          ? (lastPage.pagination.page ?? 1) + 1
          : undefined,
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

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const applyPriceFilter = () => {
    setFilters((f) => ({
      ...f,
      minPrice: priceMin ? Number(priceMin) : undefined,
      maxPrice: priceMax ? Number(priceMax) : undefined,
    }));
  };

  const applyBrandFilter = () => {
    setFilters((f) => ({ ...f, brandName: brand || undefined }));
  };

  const resetFilters = () => {
    setFilters({ sortBy: "createdAt", sortOrder: "desc" });
    setPriceMin("");
    setPriceMax("");
    setBrand("");
  };

  const allProducts = data?.pages.flatMap((p) => p.products ?? []) ?? [];
  const total = data?.pages[0]?.pagination?.total ?? 0;

  return (
    <div className={scss.SearchResults}>
      <div className="container">
        <form className={scss.searchForm} onSubmit={submitSearch}>
          <input
            className={scss.searchInput}
            type="search"
            placeholder="Поиск товаров..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className={scss.searchBtn}>
            Найти
          </button>
        </form>

        <div className={scss.head}>
          <div className={scss.countBlock}>
            {query && <span className={scss.queryLabel}>«{query}»</span>}
            <span className={scss.countNum}>{total}</span>
            <span className={scss.countLabel}>товаров</span>
          </div>

          <div className={scss.sortGroup}>
            <span className={scss.sortLabel}>Сортировка</span>
            {SORT_OPTIONS.map((opt, idx) => (
              <button
                key={idx}
                className={`${scss.sortBtn} ${activeSortIdx === idx ? scss.sortBtnActive : ""}`}
                onClick={() =>
                  setFilters((f) => ({ ...f, sortBy: opt.sortBy, sortOrder: opt.sortOrder }))
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={scss.layout}>
          <aside className={scss.aside}>
            <div className={scss.filterSection}>
              <p className={scss.filterTitle}>Цена</p>
              <div className={scss.priceRow}>
                <input
                  className={scss.priceInput}
                  type="number"
                  min={0}
                  placeholder="от"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span className={scss.priceDash}>—</span>
                <input
                  className={scss.priceInput}
                  type="number"
                  min={0}
                  placeholder="до"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
              <button className={scss.applyBtn} onClick={applyPriceFilter}>
                Применить
              </button>
            </div>

            <div className={scss.filterSection}>
              <p className={scss.filterTitle}>Пол</p>
              <div className={scss.chips}>
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${scss.chip} ${filters.gender === opt.value ? scss.chipActive : ""}`}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        gender: f.gender === opt.value ? undefined : opt.value,
                      }))
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={scss.filterSection}>
              <p className={scss.filterTitle}>Сезон</p>
              <div className={scss.chips}>
                {SEASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${scss.chip} ${filters.season === opt.value ? scss.chipActive : ""}`}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        season: f.season === opt.value ? undefined : opt.value,
                      }))
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={scss.filterSection}>
              <p className={scss.filterTitle}>Бренд</p>
              <input
                className={scss.brandInput}
                type="text"
                placeholder="Например, Nike"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyBrandFilter()}
              />
              <button className={scss.applyBtn} onClick={applyBrandFilter}>
                Найти
              </button>
            </div>

            <div className={scss.filterSection}>
              <button className={scss.resetBtn} onClick={resetFilters}>
                Сбросить фильтры
              </button>
            </div>
          </aside>

          <div className={scss.main}>
            {allProducts.length === 0 && !isLoading ? (
              <div className={scss.emptyState}>
                <h3>
                  {query
                    ? `По запросу «${query}» ничего не найдено`
                    : "Введите поисковый запрос"}
                </h3>
                <button onClick={resetFilters}>Сбросить фильтры</button>
              </div>
            ) : (
              <>
                <Grid products={allProducts} isLoading={isLoading} isError={isError} />
                <div ref={sentinelRef} style={{ height: "20px" }} />
                {isFetchingNextPage && <div className={scss.loader}>Загрузка...</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
