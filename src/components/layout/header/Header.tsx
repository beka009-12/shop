"use client";
import { useEffect, useState, type FC } from "react";
import scss from "./Header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import Mobile from "../mobileNavigation/Mobile";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`${scss.Header} ${hidden ? scss.hidden : ""}`}>
        <div className="container">
          <div className={scss.content}>
            <div onClick={() => router.push("/")} className={scss.logo}>
              <h1>
                <span>Shop</span>Nest
              </h1>
              <span className={scss.online}>online store</span>
            </div>

            <div className={scss.navigation}>
              <nav>
                <p onClick={() => router.push("/")}>Главная</p>
                <p onClick={() => router.push("/shops")}>Магазины</p>
                <p onClick={() => router.push("/category")}>Каталоги</p>
                <p onClick={() => router.push("/contacts")}>Контакты</p>
              </nav>
            </div>

            <div className={scss.cart}>
              <div
                onClick={() => router.push("/cart")}
                className={`${scss.cartLink} ${
                  isActive("/cart") ? scss.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  color="black"
                  className={scss.cartIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.5 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className={scss.cartCount}>2</span>
              </div>

              <div
                onClick={() => router.push("/authentication")}
                className={`${scss.cartLink} ${
                  isActive("/favorites") ? scss.active : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={scss.cartIcon}
                  color="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <span className={scss.cartCount}>3</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Mobile />
    </>
  );
};

export default Header;
