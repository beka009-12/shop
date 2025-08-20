import { type FC } from "react";
import scss from "./Footer.module.scss";

const Footer: FC = () => {
  return (
    <footer id={scss.Footer}>
      <div className="container">
        <div className={scss.content}>Footer</div>
      </div>
    </footer>
  );
};

export default Footer;
