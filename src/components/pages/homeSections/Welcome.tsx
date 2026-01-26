"use client";
import { type FC, useState, useRef, useLayoutEffect } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cards/Grid";

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Хиты продаж" },
];

const Welcome: FC = () => {
  const { data, isLoading } = useGetProduct();
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const tabsEl = tabsRef.current;
    const underlineEl = underlineRef.current;
    if (!tabsEl || !underlineEl) return;

    const activeButton = tabsEl.querySelector(
      `.${scss.tab}.${scss.active}`,
    ) as HTMLElement | null;

    if (!activeButton) return;

    requestAnimationFrame(() => {
      underlineEl.style.width = `${activeButton.offsetWidth}px`;
      underlineEl.style.transform = `translateX(${activeButton.offsetLeft}px)`;
    });
  }, [activeTab]);

  return (
    <section className={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.filters}>
            <div className={scss.tabs} ref={tabsRef}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`${scss.tab} ${
                    activeTab === tab.id ? scss.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}

              <span className={scss.underline} ref={underlineRef} />
            </div>
            <form className={scss.form}>
              <label htmlFor="search">
                <input
                  className={scss.input}
                  type="text"
                  required
                  placeholder="Поиск товаров"
                  id="search"
                />
                <div className={scss.fancy_bg} />
                <div className={scss.search}>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr"
                  >
                    <g>
                      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                    </g>
                  </svg>
                </div>
                <button className={scss.close_btn} type="reset">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </label>
            </form>
          </div>

          <Grid products={data?.products || []} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
