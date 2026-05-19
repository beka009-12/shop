"use client";
import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import scss from "./Profile.module.scss";
import UpdateProfile from "./update/UpdateProfile";
import { usePostAuthLogout } from "@/api/generated/endpoints/auth/auth";
import { useGetUserProfile } from "@/api/generated/endpoints/user/user";
import { useGetCart } from "@/api/generated/endpoints/cart/cart";
import { useGetFavoriteFavorites } from "@/api/generated/endpoints/favorite/favorite";
import {
  useGetAddresses,
  usePostAddresses,
  usePatchAddressesId,
  useDeleteAddressesId,
  usePatchAddressesIdDefault,
  getGetAddressesQueryKey,
} from "@/api/generated/endpoints/address/address";
import { CreateAddressInput, Address } from "@/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";

// ── Address Modal ──────────────────────────────────────────────────

interface AddressModalProps {
  initial?: Address;
  onClose: () => void;
}

const AddressModal: FC<AddressModalProps> = ({ initial, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!initial?.id;

  const { register, handleSubmit, formState: { errors } } = useForm<CreateAddressInput>({
    defaultValues: initial
      ? {
          label: initial.label ?? "",
          name: initial.name ?? "",
          phone: initial.phone ?? "",
          address: initial.address ?? "",
          city: initial.city ?? "",
          region: initial.region ?? "",
          isDefault: initial.isDefault ?? false,
        }
      : { isDefault: false },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });

  const { mutateAsync: create, isPending: creating } = usePostAddresses({
    mutation: { onSuccess: invalidate },
  });

  const { mutateAsync: update, isPending: updating } = usePatchAddressesId({
    mutation: { onSuccess: invalidate },
  });

  const isPending = creating || updating;

  const onSubmit = async (data: CreateAddressInput) => {
    try {
      if (isEdit) {
        await update({ id: initial!.id!, data });
        toast.success("Адрес обновлён");
      } else {
        await create({ data });
        toast.success("Адрес добавлен");
      }
      onClose();
    } catch {
      toast.error("Ошибка при сохранении");
    }
  };

  return (
    <div className={scss.modalBackdrop} onClick={onClose}>
      <div className={scss.addrModalBox} onClick={(e) => e.stopPropagation()}>
        <div className={scss.addrModalHeader}>
          <span className={scss.addrModalTitle}>
            {isEdit ? "Редактировать адрес" : "Новый адрес"}
          </span>
          <button className={scss.addrModalClose} onClick={onClose} aria-label="Закрыть">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className={scss.addrForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={scss.addrFieldGroup}>
            <label className={scss.addrLabel2}>Название</label>
            <input
              className={scss.addrInput}
              placeholder="Дом / Работа / Другое"
              {...register("label", { required: true })}
            />
            {errors.label && <span className={scss.addrError}>Обязательное поле</span>}
          </div>

          <div className={scss.addrFieldGroup}>
            <label className={scss.addrLabel2}>Имя получателя</label>
            <input
              className={scss.addrInput}
              placeholder="Иван Иванов"
              {...register("name", { required: true })}
            />
            {errors.name && <span className={scss.addrError}>Обязательное поле</span>}
          </div>

          <div className={scss.addrFieldGroup}>
            <label className={scss.addrLabel2}>Телефон</label>
            <input
              className={scss.addrInput}
              placeholder="+996 700 000 000"
              {...register("phone", { required: true })}
            />
            {errors.phone && <span className={scss.addrError}>Обязательное поле</span>}
          </div>

          <div className={scss.addrFieldGroup}>
            <label className={scss.addrLabel2}>Улица, дом, квартира</label>
            <input
              className={scss.addrInput}
              placeholder="ул. Токтогула 98, кв. 12"
              {...register("address", { required: true })}
            />
            {errors.address && <span className={scss.addrError}>Обязательное поле</span>}
          </div>

          <div className={scss.addrRow2}>
            <div className={scss.addrFieldGroup}>
              <label className={scss.addrLabel2}>Город</label>
              <input
                className={scss.addrInput}
                placeholder="Бишкек"
                {...register("city")}
              />
            </div>
            <div className={scss.addrFieldGroup}>
              <label className={scss.addrLabel2}>Регион</label>
              <input
                className={scss.addrInput}
                placeholder="Чуйская"
                {...register("region")}
              />
            </div>
          </div>

          <label className={scss.addrCheckbox}>
            <input type="checkbox" {...register("isDefault")} />
            <span className={scss.addrCheckboxBox} />
            <span className={scss.addrCheckboxLabel}>Сделать основным адресом</span>
          </label>

          <div className={scss.addrFormActions}>
            <button type="button" className={scss.cancelBtn} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={scss.addrSaveBtn} disabled={isPending}>
              {isPending ? "Сохраняем..." : isEdit ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Profile ────────────────────────────────────────────────────────

interface ProfilePageProps {
  onClose?: () => void;
}

const Profile: FC<ProfilePageProps> = ({ onClose }) => {
  const { data: user } = useGetUserProfile();
  const { mutateAsync: logoutMutation, reset: resetProfile } = usePostAuthLogout();
  const queryClient = useQueryClient();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addrModal, setAddrModal] = useState<{ open: boolean; address?: Address }>({ open: false });
  const router = useRouter();

  const { data: cartData } = useGetCart();
  const { data: favorite } = useGetFavoriteFavorites();
  const { data: addressesData } = useGetAddresses();
  const addresses = addressesData?.addresses ?? [];

  const cartCount = cartData?.items?.length || 0;
  const favCount = favorite?.favorites?.length || 0;

  const initials = user?.user?.name
    ? user.user.name.slice(0, 2).toUpperCase()
    : user?.user?.email
      ? user.user.email.slice(0, 2).toUpperCase()
      : "АА";

  const invalidateAddresses = () =>
    queryClient.invalidateQueries({ queryKey: getGetAddressesQueryKey() });

  const { mutate: deleteAddress } = useDeleteAddressesId({
    mutation: {
      onSuccess: () => {
        invalidateAddresses();
        toast.success("Адрес удалён");
      },
      onError: () => toast.error("Ошибка при удалении"),
    },
  });

  const { mutate: setDefault } = usePatchAddressesIdDefault({
    mutation: {
      onSuccess: () => {
        invalidateAddresses();
        toast.success("Основной адрес изменён");
      },
      onError: () => toast.error("Ошибка"),
    },
  });

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation();
      localStorage.removeItem("token");
      toast.success("Вы вышли из аккаунта");
      resetProfile();
      router.push("/");
    } catch {
      toast.error("Ошибка при выходе");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const go = (path: string) => {
    onClose?.();
    router.push(path);
  };

  return (
    <div className={scss.page}>

      {/* ── Hero ── */}
      <div className={scss.hero}>
        <div className={scss.heroCover}>
          <span className={scss.heroCoverMark}>MEMBER</span>
        </div>
        <div className={scss.heroBody}>
          <div className={scss.avatarRow}>
            <div className={scss.avatar}>
              <div className={scss.avatarRing} />
              <div className={scss.avatarInner}>
                {user?.user?.avatar ? (
                  <img src={user.user.avatar} alt="Аватар" className={scss.avatarImg} />
                ) : (
                  <span className={scss.avatarIni}>{initials}</span>
                )}
              </div>
            </div>
            <button className={scss.editBtn} onClick={() => setShowEditModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              Изменить
            </button>
          </div>
          <p className={scss.userName}>{user?.user?.name || "Без имени"}</p>
          <p className={scss.userEmail}>{user?.user?.email || "email не указан"}</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={scss.stats}>
        <div className={scss.stat} onClick={() => go("/favorites")}>
          <div className={scss.statNum}>{favCount}</div>
          <div className={scss.statLabel}>Избранное</div>
        </div>
        <div className={scss.stat} onClick={() => go("/cart")}>
          <div className={scss.statNum}>{cartCount}</div>
          <div className={scss.statLabel}>Корзина</div>
        </div>
        <div className={scss.stat} onClick={() => go("/orders")}>
          <div className={scss.statNum}>0</div>
          <div className={scss.statLabel}>Заказы</div>
        </div>
      </div>

      {/* ── Contacts ── */}
      <div className={scss.card}>
        <div className={scss.cardHeader}>
          <span className={scss.cardTitle}>Контакты</span>
        </div>
        <div className={scss.contactRow}>
          <div className={scss.cIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <div className={scss.cInfo}>
            <span className={scss.cLabel}>Телефон</span>
            <span className={`${scss.cVal} ${!user?.user?.phone ? scss.cEmpty : ""}`}>
              {user?.user?.phone || "+996 ХХХ ХХХ ХХХ"}
            </span>
          </div>
        </div>
        <div className={scss.contactRow}>
          <div className={scss.cIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className={scss.cInfo}>
            <span className={scss.cLabel}>Email</span>
            <span className={scss.cVal}>{user?.user?.email || "Не указан"}</span>
          </div>
        </div>
      </div>

      {/* ── Addresses ── */}
      <div className={scss.card}>
        <div className={scss.cardHeader}>
          <span className={scss.cardTitle}>Адреса доставки</span>
          <button
            className={scss.cardAction}
            onClick={() => setAddrModal({ open: true })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className={scss.addrEmpty}>
            <div className={scss.addrEmptyIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <p className={scss.addrEmptyTitle}>Нет сохранённых адресов</p>
            <p className={scss.addrEmptySub}>Добавьте адрес для быстрого оформления</p>
            <button
              className={scss.addrEmptyBtn}
              onClick={() => setAddrModal({ open: true })}
            >
              Добавить адрес
            </button>
          </div>
        ) : (
          <div className={scss.addrList}>
            {addresses.map((addr) => (
              <div key={addr.id} className={scss.addrItem}>
                <div className={`${scss.addrDot} ${addr.isDefault ? scss.addrDotDefault : scss.addrDotWork}`}>
                  {addr.isDefault ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  )}
                </div>

                <div className={scss.addrBody}>
                  <div className={scss.addrTop}>
                    <span className={scss.addrLabel}>{addr.label}</span>
                    {addr.isDefault && <span className={scss.addrDefault}>Основной</span>}
                  </div>
                  <div className={scss.addrName}>{addr.name}</div>
                  <div className={scss.addrFull}>
                    {addr.address}{addr.city ? `, ${addr.city}` : ""}
                  </div>
                  {addr.phone && <div className={scss.addrPhone}>{addr.phone}</div>}

                  <div className={scss.addrActions}>
                    <button
                      className={scss.addrBtn}
                      onClick={() => setAddrModal({ open: true, address: addr })}
                    >
                      Изменить
                    </button>
                    {!addr.isDefault && (
                      <button
                        className={scss.addrBtn}
                        onClick={() => setDefault({ id: addr.id! })}
                      >
                        Сделать основным
                      </button>
                    )}
                    <button
                      className={`${scss.addrBtn} ${scss.addrBtnDanger}`}
                      onClick={() => deleteAddress({ id: addr.id! })}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className={scss.navCard}>
        <button className={scss.navItem} onClick={() => go("/favorites")}>
          <div className={scss.navLeft}>
            <div className={`${scss.nIcon} ${scss.iconFav}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <div className={scss.nText}>
              <span className={scss.nLabel}>Избранное</span>
              <span className={scss.nSub}>Сохранённые товары</span>
            </div>
          </div>
          <div className={scss.navRight}>
            <span className={scss.nBadge}>{favCount}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={scss.nArrow}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        <button className={scss.navItem} onClick={() => go("/cart")}>
          <div className={scss.navLeft}>
            <div className={`${scss.nIcon} ${scss.iconCart}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <div className={scss.nText}>
              <span className={scss.nLabel}>Корзина</span>
              <span className={scss.nSub}>Товары к оформлению</span>
            </div>
          </div>
          <div className={scss.navRight}>
            <span className={scss.nBadge}>{cartCount}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={scss.nArrow}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        <button className={scss.navItem} onClick={() => go("/orders")}>
          <div className={scss.navLeft}>
            <div className={`${scss.nIcon} ${scss.iconOrders}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <div className={scss.nText}>
              <span className={scss.nLabel}>Мои заказы</span>
              <span className={scss.nSub}>История покупок</span>
            </div>
          </div>
          <div className={scss.navRight}>
            <span className={scss.nBadge}>0</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={scss.nArrow}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      </nav>

      {/* ── Logout ── */}
      <button className={scss.logoutBtn} onClick={() => setShowLogoutModal(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Выйти из аккаунта
      </button>

      {/* ── Address modal ── */}
      {addrModal.open && (
        <AddressModal
          initial={addrModal.address}
          onClose={() => setAddrModal({ open: false })}
        />
      )}

      {/* ── Edit profile modal ── */}
      {showEditModal && (
        <div className={scss.modalBackdrop} onClick={() => setShowEditModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateProfile onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

      {/* ── Logout confirm modal ── */}
      {showLogoutModal && (
        <div className={scss.modalBackdrop} onClick={() => setShowLogoutModal(false)}>
          <div className={scss.modalBox} onClick={(e) => e.stopPropagation()}>
            <p className={scss.modalTitle}>Выйти из аккаунта?</p>
            <p className={scss.modalSub}>Вы уверены? Придётся войти заново.</p>
            <div className={scss.modalActions}>
              <button className={scss.cancelBtn} onClick={() => setShowLogoutModal(false)}>
                Отмена
              </button>
              <button className={scss.confirmBtn} onClick={handleConfirmLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
