import { type FC } from "react";
import scss from "./Btn.module.scss";

interface BtnProps {
  title?: string;
}

const Btn: FC<BtnProps> = ({ title }) => {
  return (
    <section className={scss.Btn}>
      <div className="container">
        <div className={scss.content}>{title}</div>
      </div>
    </section>
  );
};

export default Btn;
