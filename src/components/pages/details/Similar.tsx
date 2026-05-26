"use client";
import { type FC } from "react";
import { useParams } from "next/navigation";
import scss from "./Similar.module.scss";
import { useGetCommoditySimilarProductsId } from "@/api/generated/endpoints/product/product";
import Cards from "@/utils/ui/cards/Cards";
import CardSceleton from "@/utils/ui/cards/CardSceleton";

const Similar: FC = () => {
  const { id } = useParams();
  const { data, isPending } = useGetCommoditySimilarProductsId(Number(id));

  const products = data?.products ?? [];

  const isEmpty = !isPending && products.length === 0;

  return (
    <section className={scss.section}>
      <div className={scss.inner}>
        <h2 className={scss.title}>Похожие товары</h2>

        {isEmpty ? (
          <div className={scss.empty}>
            <span className={scss.emptyIcon}>🔍</span>
            <p className={scss.emptyText}>Похожих товаров пока нет</p>
            <p className={scss.emptySub}>Мы покажем их здесь, как только они появятся</p>
          </div>
        ) : (
          <div className={scss.scroll}>
            {isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={scss.card}>
                    <CardSceleton />
                  </div>
                ))
              : products.map((p) => (
                  <div key={p.id} className={scss.card}>
                    <Cards {...p} />
                  </div>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Similar;
