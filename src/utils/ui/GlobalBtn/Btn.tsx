import { type FC } from "react";
import scss from "./Btn.module.scss";

interface BtnProps {
  title?: string;
  onClick?: () => void;
}

const Btn: FC<BtnProps> = ({ title, onClick }) => {
  return (
    <button className={scss.btn} onClick={onClick}>
      {title}
    </button>
  );
};

const CartBtn: FC<BtnProps> = ({ title, onClick }) => {
  return (
    <button className={scss.cartBtn} onClick={onClick}>
      {title}
    </button>
  );
};

export { CartBtn, Btn };
