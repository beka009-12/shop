"use client";
import { type FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import scss from "./DockSearch.module.scss";
import { useGetSearchProducts } from "@/api/generated/endpoints/search/search";

const springs = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
};

const SearchIcon: FC<{ size?: number; color?: string }> = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const DockSearch: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const { data } = useGetSearchProducts(
    { search: query, page: 1 },
    { query: { enabled: query.length >= 2, staleTime: 1000 * 10 } },
  );
  const products = data?.products ?? [];

  // CMD+K / ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") { setIsOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const close = () => { setIsOpen(false); setQuery(""); };
  const goToProduct = (id: number) => { close(); router.push(`/product/${id}`); };

  return (
    <div ref={wrapRef} className={scss.root}>

      {/* Results — slides up above the bar */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            className={scss.results}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={springs.gentle}
          >
            {products.length === 0 ? (
              <p className={scss.empty}>Ничего не найдено</p>
            ) : (
              <>
                <p className={scss.resultsLabel}>Результаты</p>
                {products.slice(0, 6).map((p) => {
                  const imgUrl = p.productImages?.[0]?.url;
                  return (
                    <div
                      key={p.id}
                      className={scss.resultItem}
                      onClick={() => p.id && goToProduct(p.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && p.id && goToProduct(p.id)}
                    >
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.title ?? ""} width={36} height={36} className={scss.resultImg} style={{ objectFit: "cover" }} />
                      ) : (
                        <div className={scss.resultImgPlaceholder} />
                      )}
                      <div className={scss.resultText}>
                        <p className={scss.resultName}>{p.title}</p>
                        <p className={scss.resultPrice}>{p.newPrice ?? p.price} сом</p>
                      </div>
                    </div>
                  );
                })}
                <div className={scss.resultsFooter}>
                  <button className={scss.seeAll} onClick={() => { close(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}>
                    Все результаты →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill — CSS width transition (no layout animation to avoid translateX conflict) */}
      <div className={scss.pill} data-open={isOpen}>

        {/* Icon — always visible */}
        <button
          className={scss.iconBtn}
          onClick={() => !isOpen && setIsOpen(true)}
          aria-label="Поиск"
          tabIndex={isOpen ? -1 : 0}
        >
          <span className={scss.pillIcon}>
            <SearchIcon size={13} color="#fff" />
          </span>
        </button>

        {/* Closed label */}
        <AnimatePresence initial={false}>
          {!isOpen && (
            <motion.button
              key="label"
              className={scss.labelBtn}
              onClick={() => setIsOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <span className={scss.pillText}>Поиск товаров</span>
              <span className={scss.pillShortcut}>⌘K</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Open input — autoFocus fires immediately on mount */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="inputwrap"
              className={scss.inputWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <input
                // autoFocus mounts and focuses immediately — no setTimeout needed
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className={scss.input}
                placeholder="Поиск товаров..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    close();
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
              />
              <button className={scss.escBtn} onClick={close} tabIndex={0} aria-label="Закрыть">
                ESC
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default DockSearch;
