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

        <Grid products={allProducts} isLoading={isLoading} isError={isError} />
        <div ref={sentinelRef} style={{ height: "20px" }} />
        {isFetchingNextPage && <div className={scss.loader}>Загрузка...</div>}
      </div>
    </section>
  );
};

export default Welcome;
