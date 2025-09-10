"use client";
import { FC, useState } from "react";
import scss from "./Mobile.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { useGetMe } from "@/api/user";
import Profile from "@/components/pages/profile/Profile";

const Mobile: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: getMe, isLoading } = useGetMe();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAuthenticated = Boolean(getMe?.user.id && getMe?.user.email);
  const role = getMe?.user.role;

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    if (!isAuthenticated && !isLoading) {
      router.push("/sign-up");
      return;
    }
    if (isAuthenticated) {
      router.push(path);
    }
  };

  if (isLoading)
    return (
      <div className="container">
        <div className={scss.bottomHeader}></div>
      </div>
    );

  return (
    <>
      <div className="container">
        <div className={scss.bottomHeader}>
          {/* Дом */}
          <div
            onClick={() => handleNavigation("/")}
            className={`${scss.cartLink} ${isActive("/") ? scss.active : ""}`}
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
            onClick={() => handleNavigation("/cart")}
            className={`${scss.cartLink} ${
              isActive("/cart") ? scss.active : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={scss.cartIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.5 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className={scss.cartCount}>
              {isAuthenticated ? "2" : "0"}
            </span>
          </div>

          {/* Кнопка по роли */}
          {role === "OWNER" ? (
            <button
              onClick={() => handleNavigation("/createProduct")}
              className={scss.addBtn}
            >
              {/* плюсик для OWNER */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={scss.iconPlus}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => handleNavigation("/category")}
              className={scss.addCategory}
            >
              {/* категории для USER */}
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
          )}

          {/* Избранное */}
          <div
            onClick={() => handleNavigation("/favorites")}
            className={`${scss.cartLink} ${
              isActive("/favorites") ? scss.active : ""
            }`}
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
              {isAuthenticated ? "3" : "0"}
            </span>
          </div>

          {/* Профиль или авторизация */}
          {isAuthenticated ? (
            <div
              onClick={() => setIsProfileOpen((prev) => !prev)}
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
              className={`${scss.avatar} ${
                isActive("/sign-up") ? scss.active : ""
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                style={{ width: "24px", height: "24px" }}
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
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </>
  );
};

export default Mobile;
