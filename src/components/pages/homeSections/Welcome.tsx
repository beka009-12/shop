"use client";
import { type FC, useState, useRef, useLayoutEffect } from "react";
import scss from "./Welcome.module.scss";
import { useGetProduct } from "@/api/product";
import Grid from "@/utils/ui/cards/Grid";
import Search from "@/utils/ui/search/Search";

const TABS = [
  { id: "all", label: "Все товары" },
  { id: "sale", label: "Акции и скидки" },
  { id: "new", label: "Новинки" },
  { id: "popular", label: "Хиты продаж" },
];

const Welcome: FC = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetProduct({
    search: search,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

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
            <Search onSearch={handleSearch} />
          </div>

          <Grid products={data?.products || []} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};

export default Welcome;
