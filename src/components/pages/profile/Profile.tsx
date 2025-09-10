"use client";
import { type FC } from "react";
import scss from "./Profile.module.scss";
import { useGetMe } from "@/api/user";

interface ProfileProps {
  onClose: () => void;
}

const Profile: FC<ProfileProps> = ({ onClose }) => {
  const { data: user } = useGetMe();

  const menuItems = [
    {
      id: "favorites",
      label: "Избранное",
      count: 1 || 12,
      className: scss.favorites,
    },
    {
      id: "cart",
      label: "Корзина",
      count: 1 || 3,
      className: scss.cart,
    },
    {
      id: "orders",
      label: "Мои заказы",
      count: 1 || 8,
      className: scss.orders,
    },
  ];

  const handleMenuClick = (itemId: string) => {
    switch (itemId) {
      case "favorites":
        break;
      case "cart":
        break;
      case "orders":
        break;
    }
  };

  const handleLogout = () => {
    console.log("Выход из аккаунта");
  };

  return (
    <section className={scss.Profile}>
      <div className="container">
        <div className={scss.wrapper}>
          <div className={scss.card}>
            {/* Кнопка закрытия */}
            <button className={scss.closeBtn} onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>

            {/* Аватар */}
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
              <p className={scss.phone}>
                {user?.user.phone || "+996 ХХХ ХХХ ХХХ"}
              </p>
              <p className={scss.email}>{user?.user.email || "Не указан"}</p>
            </div>

            {/* Секция меню */}
            <div className={scss.menuSection}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={scss.menuItem}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <div className={scss.menuLeft}>
                    <div className={`${scss.menuIcon} ${scss[item.id]}`}></div>
                    <span className={scss.menuLabel}>{item.label}</span>
                  </div>
                  <div className={scss.menuRight}>
                    <span className={scss.menuCount}>{item.count}</span>
                    <div className={scss.menuArrow}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Кнопка выхода */}
            <div className={scss.logoutSection}>
              <button className={scss.logoutBtn} onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
