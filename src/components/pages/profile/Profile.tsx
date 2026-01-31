"use client";
import { type FC, useState } from "react";
import scss from "./Profile.module.scss";
import { Logaut, useGetMe } from "@/api/user";
import toast from "react-hot-toast";
import UpdateProfile from "./update/UpdateProfile";
import { useRouter } from "next/navigation";

interface ProfileProps {
  onClose: () => void;
}

const Profile: FC<ProfileProps> = ({ onClose }) => {
  const { data: user } = useGetMe();
  const { mutateAsync: LogautMutation, reset: resetProfile } = Logaut();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const handleEditClick = () => setShowEditModal(true);

  const handleMenuClick = (type: "favorites" | "cart" | "orders") => {
    router.push(`/${type}`);
    onClose();
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = async () => {
    try {
      await LogautMutation();
      localStorage.removeItem("token");
      toast.success("Вы успешно вышли из аккаунта");
      onClose();
      resetProfile();
    } catch {
      toast.error("Ошибка при выходе из аккаунта");
    } finally {
      setShowLogoutModal(false);
    }
  };
  const handleCancelLogout = () => setShowLogoutModal(false);

  return (
    <>
      <section className={scss.Profile}>
        <div className="container">
          <div className={scss.wrapper}>
            <div className={scss.card}>
              <button className={scss.closeBtn} onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>

              <div className={scss.avatar}>
                <img
                  src={
                    user?.user.avatar ||
                    "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
                  }
                  alt="avatar"
                />
              </div>

              <div className={scss.info}>
                <h2>{user?.user.name || "Без имени"}</h2>
                <p className={scss.edit} onClick={handleEditClick}>
                  Редактировать
                </p>
                <p className={scss.phone}>
                  {user?.user.phone || "+996 ХХХ ХХХ ХХХ"}
                </p>
                <p className={scss.email}>{user?.user.email || "Не указан"}</p>
              </div>

              {/* Динамическое меню */}
              <div className={scss.menuSection}>
                <button
                  className={scss.menuItem}
                  onClick={() => handleMenuClick("favorites")}
                >
                  <div className={scss.menuLeft}>
                    <div className={`${scss.menuIcon} ${scss.favorites}`}></div>
                    <span className={scss.menuLabel}>Избранное</span>
                  </div>
                  <div className={scss.menuRight}>
                    <span className={scss.menuCount}>0</span>
                  </div>
                </button>

                <button
                  className={scss.menuItem}
                  onClick={() => handleMenuClick("cart")}
                >
                  <div className={scss.menuLeft}>
                    <div className={`${scss.menuIcon} ${scss.cart}`}></div>
                    <span className={scss.menuLabel}>Корзина</span>
                  </div>
                  <div className={scss.menuRight}>
                    <span className={scss.menuCount}>0</span>
                  </div>
                </button>

                <button
                  className={scss.menuItem}
                  onClick={() => handleMenuClick("orders")}
                >
                  <div className={scss.menuLeft}>
                    <div className={`${scss.menuIcon} ${scss.orders}`}></div>
                    <span className={scss.menuLabel}>Мои заказы</span>
                  </div>
                  <div className={scss.menuRight}>
                    <span className={scss.menuCount}>0</span>
                  </div>
                </button>
              </div>

              <div className={scss.logoutSection}>
                <button className={scss.logoutBtn} onClick={handleLogoutClick}>
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showEditModal && (
        <div className={scss.editModal}>
          <div
            className={scss.modalOverlay}
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className={scss.modalContent}>
            <UpdateProfile onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className={scss.logoutModal}>
          <div className={scss.modalOverlay} onClick={handleCancelLogout}></div>
          <div className={scss.modalContent}>
            <div className={scss.modalHeader}>
              <h3>Выйти из аккаунта?</h3>
            </div>
            <div className={scss.modalBody}>
              <p>Вы уверены, что хотите выйти из своего аккаунта?</p>
            </div>
            <div className={scss.modalActions}>
              <button className={scss.cancelBtn} onClick={handleCancelLogout}>
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
