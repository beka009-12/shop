"use client";
import { useState, type FC, useMemo } from "react";
import scss from "./Shop.module.scss";
interface Store {
  id: number;
  name: string;
  logo?: string | null;
  isVerified: boolean;
  rating: number; // 0-5
  productsCount: number;
  address: string;
  coordinates: string;
}

const MOCK_STORES: Store[] = [
  {
    id: 1,
    name: "Nest Shop",
    isVerified: true,
    rating: 4.5,
    productsCount: 120,
    address: "ул. Пушкина, дом 10, Москва",
    coordinates:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.183498845239!2d37.617635!3d55.755826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDMuNSJF!5e0!3m2!1sru!2sru!4v1625123456789",
  },
];

const Shop: FC = () => {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [minProducts, setMinProducts] = useState(0);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filteredStores = useMemo(() => {
    return MOCK_STORES.filter(
      (store) =>
        store.name.toLowerCase().includes(search.toLowerCase()) &&
        store.rating >= minRating &&
        store.productsCount >= minProducts,
    );
  }, [search, minRating, minProducts]);

  return (
    <section className={scss.Shop}>
      <div className="container">
        {/* Header и фильтры как в предыдущем ответе */}
        <header className={scss.header}>
          <h1 className={scss.title}>Магазины</h1>

          <div className={scss.filterGrid}>
            <div className={scss.filterGroup}>
              <label>Поиск по названию</label>
              <div className={scss.inputWrapper}>
                <input
                  type="text"
                  placeholder="Введите название..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className={scss.filterGroup}>
              <label>Рейтинг от</label>
              <div className={scss.inputWrapper}>
                <input
                  type="number"
                  step={0.1}
                  placeholder="0.0"
                  value={minRating || ""}
                  onChange={(e) => setMinRating(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className={scss.filterGroup}>
              <label>Кол-во товаров</label>
              <div className={scss.inputWrapper}>
                <input
                  type="number"
                  placeholder="0"
                  value={minProducts || ""}
                  onChange={(e) => setMinProducts(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </header>

        <div className={scss.storeList}>
          {MOCK_STORES.map((store) => (
            <article key={store.id} className={scss.storeCard}>
              <div className={scss.cardTop}>
                <div className={scss.logoBox}>{store.name.substring(0, 1)}</div>
                {store.isVerified && (
                  <span className={scss.badge}>Verified</span>
                )}
              </div>

              <div className={scss.cardInfo}>
                <h3>{store.name}</h3>
                <span className={scss.category}>Official Partner</span>

                <button
                  className={scss.addressBtn}
                  onClick={() => setSelectedStore(store)}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Показать на карте
                </button>
              </div>

              <div className={scss.cardFooter}>
                <div className={scss.statItem}>
                  <span className={scss.label}>Рейтинг</span>
                  <span className={`${scss.value} ${scss.ratingValue}`}>
                    {store.rating}
                  </span>
                </div>
                <div className={scss.statItem}>
                  <span className={scss.label}>Товаров</span>
                  <span className={scss.value}>{store.productsCount}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {selectedStore && (
        <div
          className={scss.modalOverlay}
          onClick={() => setSelectedStore(null)}
        >
          <div
            className={scss.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={scss.modalHeader}>
              <h2>{selectedStore.name} — Локация</h2>
              <button
                className={scss.closeBtn}
                onClick={() => setSelectedStore(null)}
              >
                ✕
              </button>
            </div>
            <div className={scss.mapPlaceholder}>
              <iframe
                title="map"
                src={selectedStore.coordinates}
                loading="lazy"
              ></iframe>
            </div>
            <div className={scss.modalFooter}>
              <p>
                <strong>Адрес:</strong> {selectedStore.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Shop;
