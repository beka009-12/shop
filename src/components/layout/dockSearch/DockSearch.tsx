"use client";
import { type FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import scss from "./DockSearch.module.scss";
import { useGetSearchProducts } from "@/api/generated/endpoints/search/search";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useGetSearchProducts(
    { search: query, page: 1 },
    { query: { enabled: query.length >= 2, staleTime: 1000 * 10 } },
  );

  const products = data?.products ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 60);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const goToProduct = (id: number) => {
    close();
    router.push(`/product/${id}`);
  };

  return (
    <>
      <button className={scss.pill} onClick={() => setIsOpen(true)} aria-label="Поиск">
        <span className={scss.pillIcon}>
          <SearchIcon size={13} color="#fff" />
        </span>
        <span className={scss.pillText}>Поиск товаров</span>
        <span className={scss.pillShortcut}>⌘K</span>
      </button>

      {isOpen && (
        <div className={scss.overlay} onClick={close}>
          <div className={scss.modal} onClick={(e) => e.stopPropagation()}>
            <div className={scss.inputRow}>
              <span className={scss.inputIcon}>
                <SearchIcon size={16} color="#5533EB" />
              </span>
              <input
                ref={inputRef}
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
              <span className={scss.escHint} onClick={close}>ESC</span>
            </div>

            {query.length >= 2 && (
              <div className={scss.results}>
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
                            <Image
                              src={imgUrl}
                              alt={p.title ?? ""}
                              width={36}
                              height={36}
                              className={scss.resultImg}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className={scss.resultImgPlaceholder} />
                          )}
                          <div>
                            <p className={scss.resultName}>{p.title}</p>
                            <p className={scss.resultPrice}>
                              {p.newPrice ?? p.price} сом
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DockSearch;
