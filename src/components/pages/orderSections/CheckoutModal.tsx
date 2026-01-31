"use client";
import { useState, type FC } from "react";
import scss from "./CheckoutModal.module.scss";
import { IMaskInput } from "react-imask";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loadingAddress, setLoadingAddress] = useState(false);

  if (!isOpen) return null;

  const city = address.split(" ").slice(0, 3).join(" ");

  const detectAddress = () => {
    setLoadingAddress(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;

        setCoords({ lat, lon });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const data = await res.json();
          setAddress(data.display_name || "");
        } catch (e) {
          alert("Не удалось определить адрес");
        } finally {
          setLoadingAddress(false);
        }
      },
      (err) => {
        setLoadingAddress(false);

        if (err.code === 1) {
          alert("Доступ к геолокации запрещён. Введите адрес вручную 🙏");
        } else {
          alert("Ошибка определения геолокации");
        }
      },
    );
  };

  // 🔹 Открыть карту
  const openMap = () => {
    if (!coords) return;
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
    window.open(url, "_blank");
  };

  return (
    <div className={scss.overlay} onClick={onClose}>
      <div className={scss.content} onClick={(e) => e.stopPropagation()}>
        <button className={scss.closeBtn} onClick={onClose}>
          ×
        </button>

        <h2 className={scss.title}>Оформление заказа</h2>

        <form className={scss.form}>
          <div className={scss.inputGroup}>
            <label>Имя получателя</label>
            <input type="text" placeholder="Введите ваше имя" />
          </div>

          <div className={scss.inputGroup}>
            <label>Телефон</label>
            <IMaskInput
              mask="+996 (000)-000-000"
              value={phone}
              onAccept={(value) => setPhone(value)}
              placeholder="+996 (___)-___-___"
              className={scss.input}
            />
          </div>

          {/* 📍 АДРЕС */}
          <div className={scss.inputGroup}>
            <label>Адрес доставки</label>

            <textarea
              value={city}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Улица, дом, квартира"
              rows={3}
            />

            <div className={scss.addressActions}>
              <button
                type="button"
                onClick={detectAddress}
                disabled={loadingAddress}
              >
                {loadingAddress ? "Определяем..." : "📍 Определить адрес"}
              </button>

              {coords && (
                <button type="button" onClick={openMap}>
                  🗺 Посмотреть на карте
                </button>
              )}
            </div>
          </div>

          <div className={scss.paymentMethods}>
            <label>Способ оплаты</label>
            <div className={scss.customSelectWrapper}>
              <div
                className={`${scss.selectHeader} ${isSelectOpen ? scss.open : ""}`}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span className={scss.methods}>
                  {paymentMethod === "cash" ? (
                    <p className={scss.methodPay}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={scss.paymentIcons}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                        />
                      </svg>
                      Наличными
                    </p>
                  ) : (
                    <p className={scss.methodPay}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={scss.paymentIcons}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6m-16.5-1.5H19.5a2.25 2.25 0 0 1 0 4.5m0-4.5H7.5a2.25 2.25 0 0 1 0-4.5z"
                        />
                      </svg>
                      Картой
                    </p>
                  )}
                </span>
                <span className={scss.arrow}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={scss.arrowIcon}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </div>

              {isSelectOpen && (
                <div className={scss.selectOptions}>
                  <div
                    className={`${scss.option} ${paymentMethod === "cash" ? scss.active : ""}`}
                    onClick={() => {
                      setPaymentMethod("cash");
                      setIsSelectOpen(false);
                    }}
                  >
                    <span className={scss.icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={scss.paymentIcons}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                        />
                      </svg>
                    </span>
                    <div className={scss.text}>
                      <strong>Наличными</strong>
                      <p>Оплата при получении заказа</p>
                    </div>
                  </div>

                  <div
                    className={`${scss.option} ${paymentMethod === "card" ? scss.active : ""}`}
                    onClick={() => {
                      setPaymentMethod("card");
                      setIsSelectOpen(false);
                    }}
                  >
                    <span className={scss.icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={scss.paymentIcons}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                    </span>
                    <div className={scss.text}>
                      <strong>Картой онлайн</strong>
                      <p>Visa, MasterCard, Элкарт</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={scss.footer}>
            <button type="submit" className={scss.submitBtn}>
              Подтвердить заказ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
