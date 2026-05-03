"use client";
import { useState, type FC } from "react";
import scss from "./Header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import Catalog from "@/components/pages/catalog/Catalog";
import { useGetOrderCartUserId } from "@/api/generated/endpoints/order/order";
import { useGetFavoriteFavoriteUserId } from "@/api/generated/endpoints/favorite/favorite";
import { useGetAuthProfile } from "@/api/generated/endpoints/auth/auth";

// ─── Icons ───────────────────────────────────────────────────
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
      clipRule="evenodd"
    />
  </svg>
);

const CatalogIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
  </svg>
);

const ShopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    strokeWidth={1.8}
  >
    <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z" />
    <path
      fillRule="evenodd"
      d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z"
      clipRule="evenodd"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: getMe, isLoading } = useGetAuthProfile();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const { data: cartItems } = useGetOrderCartUserId(getMe?.user?.id || 0);
  const { data: favorite } = useGetFavoriteFavoriteUserId(getMe?.user?.id || 0);

  const isAuthenticated = !!getMe?.user?.id;
  const cartCount = cartItems?.length || 0;
  const favCount = favorite?.favorites?.length || 0;

  const initials = getMe?.user?.name
    ? getMe.user.name.slice(0, 1).toUpperCase()
    : "U";

  const go = (path: string) => {
    if (!isAuthenticated && !isLoading && path !== "/") {
      router.push("/auth?mode=sign-up");
      return;
    }
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  // Nav items matching shop.app sidebar order exactly
  const navItems = [
    { icon: <HomeIcon />, path: "/", label: "Главная" },
    {
      icon: <CatalogIcon />,
      path: null,
      label: "Каталог",
      onClick: () => setIsCatalogOpen(true),
    },
    { icon: <CartIcon />, path: "/cart", label: "Корзина", count: cartCount },
    { icon: <ShopIcon />, path: "/shops", label: "Магазины" },
    {
      icon: <HeartIcon />,
      path: "/favorites",
      label: "Избранное",
      count: favCount,
    },
  ];

  return (
    <>
      <header className={scss.header}>
        <div className={scss.sidebar}>
          {/* Logo */}
          <button
            className={scss.logo}
            onClick={() => router.push("/")}
            aria-label="Главная"
          >
            <div className={scss.logoCircle}>
              <span className={scss.logoLetter}>SI</span>
            </div>
          </button>

          {/* Nav */}
          <nav className={scss.nav}>
            {navItems.map((item, i) => {
              const active = item.path ? isActive(item.path) : isCatalogOpen;
              return (
                <button
                  key={i}
                  className={`${scss.navBtn} ${active ? scss.navBtnActive : ""}`}
                  onClick={item.onClick ?? (() => item.path && go(item.path))}
                  aria-label={item.label}
                  title={item.label}
                >
                  <span className={scss.navIcon}>{item.icon}</span>
                  {isAuthenticated && (item.count ?? 0) > 0 && (
                    <span className={scss.badge}>{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom: user */}
          <div className={scss.bottom}>
            {isAuthenticated ? (
              <button
                className={`${scss.navBtn} ${isActive("/profile") ? scss.navBtnActive : ""}`}
                onClick={() => router.push("/profile")}
                aria-label="Профиль"
                title="Профиль"
              >
                <span className={scss.avatar}>{initials}</span>
              </button>
            ) : (
              <button
                className={scss.navBtn}
                onClick={() => router.push("/auth?mode=sign-up")}
                aria-label="Войти"
                title="Войти"
              >
                <span className={scss.navIcon}>
                  <UserIcon />
                </span>
                <span className={scss.signInLabel}>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <Catalog isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </>
  );
};

export default Header;
