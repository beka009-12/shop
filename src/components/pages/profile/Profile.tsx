"use client";
import { type FC, useEffect, useState } from "react";
import scss from "./Profile.module.scss";
import { Logaut, useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import UpdateProfile from "./update/UpdateProfile";
import { usePathname, useRouter } from "next/navigation";
import { useGetOrders } from "@/api/order";
import { useGetFavorites } from "@/api/favorite";

interface ProfileProps {
  onClose: () => void;
}

const Profile: FC<ProfileProps> = ({ onClose }) => {
  const { data: user } = useGetMe();
  const { mutateAsync: logoutMutation, reset: resetProfile } = Logaut();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const userId = user?.user?.id;
  const { data: cartItems } = useGetOrders(userId || 0);
  const { data: favorite } = useGetFavorites(userId || 0);

  const cartCount = cartItems?.length || 0;
  const favCount = favorite?.favorites?.length || 0;

  // Инициалы
  const initials = user?.user?.name
    ? user.user.name.slice(0, 2).toUpperCase()
    : user?.user?.email
      ? user.user.email.slice(0, 2).toUpperCase()
      : "АА";

  useEffect(() => {
    setShowLogoutModal(false);
    setShowEditModal(false);
  }, [pathname]);

  const handleMenuClick = (path: string) => {
    router.push(`/${path}`);
    onClose();
  };

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation();
      localStorage.removeItem("token");
      toast.success("Вы вышли из аккаунта");
      onClose();
      resetProfile();
    } catch {
      toast.error("Ошибка при выходе");
    } finally {
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <div className={scss.overlay} onClick={onClose} />

      <div className={scss.panel}>
        {/* Cover + close */}
        <div className={scss.cover}>
          <button
            className={scss.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Avatar */}
        <div className={scss.avatarWrap}>
          {user?.user?.avatar ? (
            <img className={scss.avatar} src={user.user.avatar} alt="Аватар" />
          ) : (
            <div className={scss.avatarIni}>{initials}</div>
          )}
        </div>

        {/* User info */}
        <div className={scss.userInfo}>
          <p className={scss.userName}>{user?.user?.name || "Без имени"}</p>
          <p className={scss.userEmail}>
            {user?.user?.email || "email не указан"}
          </p>
          <button
            className={scss.editBtn}
            onClick={() => setShowEditModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
              />
            </svg>
            Редактировать
          </button>
        </div>

        <div className={scss.divider} />

        {/* Contacts */}
        <div className={scss.contacts}>
          <div className={scss.contactRow}>
            <div className={scss.cIcon}>
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
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <span
              className={`${scss.cText} ${!user?.user?.phone ? scss.cPlaceholder : ""}`}
            >
              {user?.user?.phone || "+996 ХХХ ХХХ ХХХ"}
            </span>
          </div>
          <div className={scss.contactRow}>
            <div className={scss.cIcon}>
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <span className={scss.cText}>
              {user?.user?.email || "Не указан"}
            </span>
          </div>
        </div>

        <div className={scss.divider} />

        {/* Menu */}
        <nav className={scss.menu}>
          <button
            className={scss.menuItem}
            onClick={() => handleMenuClick("favorites")}
          >
            <div className={scss.menuLeft}>
              <div className={`${scss.mIcon} ${scss.iconFav}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#E24B4A"
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <span className={scss.mLabel}>Избранное</span>
            </div>
            <div className={scss.menuRight}>
              <span className={scss.mCount}>{favCount}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={scss.mArrow}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>

          <button
            className={scss.menuItem}
            onClick={() => handleMenuClick("cart")}
          >
            <div className={scss.menuLeft}>
              <div className={`${scss.mIcon} ${scss.iconCart}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="#3B6D11"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
              <span className={scss.mLabel}>Корзина</span>
            </div>
            <div className={scss.menuRight}>
              <span className={scss.mCount}>{cartCount}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={scss.mArrow}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>

          <button
            className={scss.menuItem}
            onClick={() => handleMenuClick("orders")}
          >
            <div className={scss.menuLeft}>
              <div className={`${scss.mIcon} ${scss.iconOrders}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="#185FA5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                  />
                </svg>
              </div>
              <span className={scss.mLabel}>Мои заказы</span>
            </div>
            <div className={scss.menuRight}>
              <span className={scss.mCount}>0</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={scss.mArrow}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>
        </nav>

        {/* Logout */}
        <div className={scss.bottom}>
          <button
            className={scss.logoutBtn}
            onClick={() => setShowLogoutModal(true)}
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <div
          className={scss.modalBackdrop}
          onClick={() => setShowEditModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateProfile onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

      {/* Logout confirm modal */}
      {showLogoutModal && (
        <div
          className={scss.modalBackdrop}
          onClick={() => setShowLogoutModal(false)}
        >
          <div className={scss.modalBox} onClick={(e) => e.stopPropagation()}>
            <p className={scss.modalTitle}>Выйти из аккаунта?</p>
            <p className={scss.modalSub}>Вы уверены? Придётся войти заново.</p>
            <div className={scss.modalActions}>
              <button
                className={scss.cancelBtn}
                onClick={() => setShowLogoutModal(false)}
              >
                Отмена
              </button>
              <button className={scss.confirmBtn} onClick={handleConfirmLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
