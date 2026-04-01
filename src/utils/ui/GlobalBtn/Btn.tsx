import { type FC } from "react";
import scss from "./Btn.module.scss";

interface BtnProps {
  title?: string;
  onClick?: () => void;
}

const Btn: FC<BtnProps> = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className={scss.NoteBtn}
      onClick={onClick}
      aria-label={title}
    >
      {title}
    </button>
  );
};

const CartBtn: FC<BtnProps> = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className={scss.cartBtn}
      onClick={onClick}
      aria-label={title}
    >
      {title}
    </button>
  );
};

export { CartBtn, Btn };
