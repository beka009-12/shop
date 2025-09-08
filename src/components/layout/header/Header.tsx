"use client";
import { useEffect, useState, type FC } from "react";
import scss from "./Header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import Mobile from "../mobileNavigation/Mobile";
import { useGetMe } from "@/api/user";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: getMe, isLoading } = useGetMe();

  const isAuthenticated = !!getMe?.id || !!getMe?.email || !!getMe;

  const isActive = (path: string) => pathname === path;
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Функция для обработки навигации с проверкой авторизации
  const handleNavigation = (path: string) => {
    if (!isAuthenticated && !isLoading) {
      router.push("/sign-up");
      return;
    }

    if (isAuthenticated) {
      router.push(path);
    }
  };

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
            <div onClick={() => handleNavigation("/")} className={scss.logo}>
              <h1>
                <span>Shop</span>Nest
              </h1>
              <span className={scss.online}>online store</span>
            </div>

            <div className={scss.navigation}>
              <nav>
                <p onClick={() => handleNavigation("/")}>Главная</p>
                <p onClick={() => handleNavigation("/shops")}>Магазины</p>
                <p onClick={() => handleNavigation("/category")}>Каталоги</p>
                <p onClick={() => handleNavigation("/contacts")}>Контакты</p>
              </nav>
            </div>

            <div className={scss.cart}>
              <div
                onClick={() => handleNavigation("/cart")}
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
                <span className={scss.cartCount}>
                  {/* Показываем количество только если авторизован */}
                  {isAuthenticated ? "2" : "0"}
                </span>
              </div>

              <div
                onClick={() => handleNavigation("/favorites")}
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
                <span className={scss.cartCount}>
                  {isAuthenticated ? "3" : "0"}
                </span>
              </div>

              {isAuthenticated ? (
                <div
                  onClick={() => handleNavigation("/profile")}
                  className={`${scss.cartLink} ${
                    isActive("/profile") ? scss.active : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={scss.cartIcon}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  onClick={() => router.push("/sign-up")}
                  className={`${scss.cartLink} ${
                    isActive("/sign-up") ? scss.active : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={scss.cartIcon}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <Mobile />
    </>
  );
};

export default Header;
