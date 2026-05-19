import { type FC } from "react";
import scss from "./productsNot.module.scss";
import { Btn } from "../GlobalBtn/Btn";

interface ProductsNotProps {
  type?: "error" | "empty";
}

const ProductsNot: FC<ProductsNotProps> = ({ type = "empty" }) => {
  const isError = type === "error";

  return (
    <section className={scss.productsNot}>
      <div className={scss.content}>
        <div className={scss.iconWrap}>
          <div className={scss.iconRing} />
          <div className={scss.iconBox}>
            {isError ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
            )}
          </div>
        </div>

        <h1 className={scss.title}>
          {isError ? "Что-то пошло не так" : "Здесь пока пусто"}
        </h1>

        <p className={scss.subtitle}>
          {isError
            ? "Попробуйте обновить страницу или зайдите позже."
            : "Здесь появятся товары, когда продавцы их добавят."}
        </p>

        <Btn
          onClick={() => window.location.reload()}
          title={isError ? "Обновить страницу" : "Попробовать снова"}
        />
      </div>
    </section>
  );
};

export default ProductsNot;
