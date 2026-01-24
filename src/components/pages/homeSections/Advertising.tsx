import { type FC } from "react";
import scss from "./Advertising.module.scss";

const Advertising: FC = () => {
  return (
    <section className={scss.Advertising}>
      <div className="container">
        <div className={scss.content}></div>
      </div>
    </section>
  );
};

export default Advertising;
