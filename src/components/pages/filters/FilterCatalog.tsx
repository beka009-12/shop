"use client";
import { FC } from "react";
import scss from "./FilterCatalog.module.scss";
import Grid from "@/utils/ui/cards/Grid";
import { useGetProduct } from "@/api/product";

interface Props {
  categoryId?: number;
}

const FilterCatalog: FC<Props> = ({ categoryId }) => {
  const { data, isLoading, isError } = useGetProduct({
    categoryId,
  });

  return (
    <div className={scss.FilterCatalog}>
      <div className="container">
        <div className={scss.content}>
          <Grid
            products={data?.products}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterCatalog;
