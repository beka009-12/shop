import { type FC, ReactNode } from "react";
import scss from "./Layout.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Mobile from "./mobileNavigation/Mobile";

interface ILay {
  children: ReactNode;
}

const Layout: FC<ILay> = ({ children }) => {
  return (
    <div className={scss.Layout}>
      <Header />
      <main>
        <div className={scss.card}>
          {children}
          <Footer />
        </div>
      </main>
      <Mobile />
    </div>
  );
};

export default Layout;
