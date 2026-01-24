import { type FC } from "react";
import scss from "./Catalog.module.scss";

const Catalog: FC = () => {
  return (
    <section className={scss.Catalog}>
      <div className="container">
        <div className={scss.content}>Catalog</div>
      </div>
    </section>
  );
};

export default Catalog;
