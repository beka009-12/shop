"use client";
import { FC, useState } from "react";
import clsx from "clsx";
import scss from "./Mobile.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { useGetMe } from "@/api/user";
import Profile from "@/components/pages/profile/Profile";
import { useGetFavorites } from "@/api/favorite";
import { useGetOrders } from "@/api/order";
import Catalog from "@/components/pages/catalog/Catalog";

const Mobile: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: getMe, isLoading } = useGetMe();
  const { data: favorite } = useGetFavorites(getMe?.user.id || 0);
  const { data: cartItems } = useGetOrders(getMe?.user.id || 0);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const isAuthenticated = Boolean(getMe?.user.id && getMe?.user.email);

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth?mode=login");
      return;
    }
    if (isAuthenticated) {
      router.push(path);
    }
  };

  const navigateAndCloseProfile = (path: string) => {
    setIsProfileOpen(false);
    handleNavigation(path);
  };

  return (
    <>
      <div className="container">
        <div className={scss.bottomHeader}>
          {/* Дом */}
          <div
            onClick={() => navigateAndCloseProfile("/")}
            className={clsx(scss.cartLink, isActive("/") && scss.active)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={scss.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>

          {/* Корзина */}
          <div
            onClick={() => navigateAndCloseProfile("/cart")}
            className={clsx(scss.cartLink, isActive("/cart") && scss.active)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              className={scss.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <span className={scss.cartCount}>{cartItems?.length || 0}</span>
          </div>

          {/* Каталог (центральная кнопка) */}
          <button
            onClick={() => {
              setIsProfileOpen(false);
              setIsCatalogOpen(true);
            }}
            className={scss.addCategory}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={scss.categoryIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </button>

          {/* Избранное */}
          <div
            onClick={() => navigateAndCloseProfile("/favorites")}
            className={clsx(
              scss.cartLink,
              isActive("/favorites") && scss.active,
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={scss.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span className={scss.cartCount}>
              {favorite?.favorites.length || 0}
            </span>
          </div>

          {/* Профиль или авторизация */}
          <div
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
            }}
            className={clsx(scss.cartLink, isActive("/profile") && scss.active)}
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
        </div>
      </div>

      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      {isCatalogOpen && (
        <Catalog
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}
    </>
  );
};

export default Mobile;
