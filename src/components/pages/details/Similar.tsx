import { type FC } from "react";
import scss from "./Similar.module.scss";

const Similar: FC = () => {
  return (
    <section className={scss.Similar}>
      <div className="container">
        <div className={scss.content}>Similar</div>
      </div>
    </section>
  );
};

export default Similar;
