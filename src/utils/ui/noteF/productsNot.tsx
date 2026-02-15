import { type FC } from "react";
import scss from "./productsNot.module.scss";
import { Btn } from "../GlobalBtn/Btn";

interface ProductsNotProps {
  type?: "error" | "empty";
}

const ProductsNot: FC<ProductsNotProps> = ({ type = "empty" }) => {
  const isError = type === "error";
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className={scss.productsNot}>
      <div className="container">
        <div className={scss.content}>
          <h1 className={scss.title}>
            {isError ? "Что-то пошло не так 😕" : "Пока ничего нет 🛍️"}
          </h1>

          <p className={scss.subtitle}>
            {isError
              ? "Попробуйте обновить страницу или зайдите позже."
              : "Здесь появятся товары, когда продавцы их добавят."}
          </p>

          <Btn onClick={handleRefresh} title="Обновить страницу" />
        </div>
      </div>
    </section>
  );
};

export default ProductsNot;
