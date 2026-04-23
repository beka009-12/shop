"use client";
import { useEffect, useState, type FC } from "react";
import scss from "./Header.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/utils/constant/Link";
import Catalog from "@/components/pages/catalog/Catalog";
import Profile from "@/components/pages/profile/Profile";
import { useGetOrderCartUserId } from "@/api/generated/endpoints/order/order";
import { useGetFavoriteFavoriteUserId } from "@/api/generated/endpoints/favorite/favorite";
import { useGetAuthProfile } from "@/api/generated/endpoints/auth/auth";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: getMe, isLoading } = useGetAuthProfile();

  // State for header visibility and dropdowns
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const { data: cartItems } = useGetOrderCartUserId(getMe?.user?.id || 0);
  const { data: favorite } = useGetFavoriteFavoriteUserId(getMe?.user?.id || 0);

  const isAuthenticated = !!getMe?.user?.id || !!getMe?.user?.email || !!getMe;
  const isActive = (path: string) => pathname === path;

  const cartCount = cartItems?.length || 0;
  const favCount = favorite?.favorites?.length || 0;

  const initials = getMe?.user?.name
    ? getMe.user.name.slice(0, 2).toUpperCase()
    : getMe?.user?.email
      ? getMe.user.email.slice(0, 2).toUpperCase()
      : "АА";

  const handleNavigation = (path: string) => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth?mode=sign-up");
      return;
    }
    router.push(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY && currentY > 80);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`${scss.header} ${hidden ? scss.hidden : ""}`}>
        <div className="container">
          <div className={scss.content}>
            {/* Logo */}
            <div className={scss.logo} onClick={() => router.push("/")}>
              <span className={scss.logoMain}>
                <span>Shop</span>Ix
              </span>
              <span className={scss.logoSub}>store</span>
            </div>

            {/* Navigation */}
            <div className={scss.navigation}>
              <nav>
                {links.map((link, i) => (
                  <button
                    key={i}
                    className={`${scss.navLink} ${isActive(link.path) ? scss.navLinkActive : ""}`}
                    onClick={() => handleNavigation(link.path)}
                    aria-label={link.name}
                  >
                    {link.name}
                  </button>
                ))}
                <button
                  className={scss.catalogBtn}
                  onClick={() => setIsCatalogOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                  Каталог
                </button>
              </nav>
            </div>

            {/* Icons */}
            <div className={scss.icons}>
              {/* Favorites */}
              <button
                className={`${scss.iconBtn} ${scss.hideOnMobile}`}
                onClick={() => handleNavigation("/favorites")}
                aria-label="Избранное"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                {isAuthenticated && favCount > 0 && (
                  <span className={scss.badge}>{favCount}</span>
                )}
              </button>

              {/* Cart */}
              <button
                className={`${scss.iconBtn} ${scss.hideOnMobile}`}
                onClick={() => handleNavigation("/cart")}
                aria-label="Корзина"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                {isAuthenticated && cartCount > 0 && (
                  <span className={scss.badge}>{cartCount}</span>
                )}
              </button>

              {/* Profile / Avatar */}
              {isAuthenticated ? (
                <button
                  className={scss.avatar}
                  onClick={() => setIsProfileOpen((p) => !p)}
                  aria-label="Профиль"
                >
                  {initials}
                </button>
              ) : (
                <button
                  className={scss.iconBtn}
                  onClick={() => router.push("/auth?mode=sign-up")}
                  aria-label="Войти"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      <Catalog isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </>
  );
};

export default Header;
