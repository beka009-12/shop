"use client";
import { type FC } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cardGrid/Grid";

const Welcome: FC = () => {
  const { data, isLoading, error } = useGetProduct();

  if (isLoading) {
    return (
      <section className={scss.Welcome}>
        <div className="container">
          <div className={scss.content}>
            <p>Загрузка товаров...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={scss.Welcome}>
        <div className="container">
          <div className={scss.content}>
            <p>Ошибка загрузки товаров: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          {/* Передаем products из data */}
          <Grid products={data?.products || []} />

          {/* Опционально: пагинация */}
          {data?.pagination && (
            <div className={scss.pagination}>
              <p>
                Показано {data.products.length} из {data.pagination.total}{" "}
                товаров
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
