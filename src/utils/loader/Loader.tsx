import { type FC } from "react";
import scss from "./Loader.module.scss";

const Loader: FC = () => {
  return (
    <div className={scss.loaderWrapper}>
      <div className={scss.loader}></div>
    </div>
  );
};

export default Loader;
