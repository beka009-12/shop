"use client";
import { useState, type FC } from "react";
import scss from "./Header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import Catalog from "@/components/pages/catalog/Catalog";
import Profile from "@/components/pages/profile/Profile";
import { useGetOrderCartUserId } from "@/api/generated/endpoints/order/order";
import { useGetFavoriteFavoriteUserId } from "@/api/generated/endpoints/favorite/favorite";
import { useGetAuthProfile } from "@/api/generated/endpoints/auth/auth";

// ─── Icons ───────────────────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6h.008v.008H6V6Z"
    />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    { icon: <TagIcon />, path: "/orders", label: "Заказы" },
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
              <span>S</span>
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
                className={`${scss.navBtn} ${isProfileOpen ? scss.navBtnActive : ""}`}
                onClick={() => setIsProfileOpen(true)}
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

      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      <Catalog isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </>
  );
};

export default Header;
