import { type FC } from "react";
import scss from "./Btn.module.scss";

interface BtnProps {
  title?: string;
}

const Btn: FC<BtnProps> = ({ title }) => {
  return <button className={scss.btn}> {title}</button>;
};

export default Btn;
