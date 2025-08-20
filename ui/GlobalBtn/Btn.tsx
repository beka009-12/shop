import { type FC } from "react";
import scss from "./Btn.module.scss";

const Btn: FC = () => {
  return (
    <section className={scss.Btn}>
      <div className="container">
        <div className={scss.content}>Btn</div>
      </div>
    </section>
  );
};

export default Btn;
