import { type FC } from "react";
import scss from "./CardSceleton.module.scss";

const CardSceleton: FC = () => {
  return (
    <div className={scss.CardSceleton}>
      <div className={scss.info}></div>
    </div>
  );
};

export default CardSceleton;
