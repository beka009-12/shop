"use client";
import { type FC, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import scss from "./ShopsRow.module.scss";
import { useGetShops } from "@/api/generated/endpoints/shops/shops";
import { ShopSummary } from "@/api/generated/models";

const MAX_SHOPS = 8;

// Gradient covers for shops without logo images
const COVER_GRADIENTS = [
  ["#0f0a2e", "#3b1fa8"],
  ["#0a1628", "#1a3a5c"],
  ["#0a2010", "#1a5c30"],
  ["#2a0a0a", "#7c2020"],
  ["#1a0a2e", "#5c1ab0"],
  ["#0a1e2e", "#1a5c7c"],
  ["#2e1a0a", "#8c4a10"],
  ["#0a2e1a", "#1a7c4c"],
];

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0] ?? "").filter(Boolean).join("").toUpperCase() || "?";

const springs = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
};

const ShopCard: FC<{ store: ShopSummary; index: number }> = ({ store, index }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [from, to] = COVER_GRADIENTS[index % COVER_GRADIENTS.length];

  return (
    <motion.div
      className={scss.card}
      onClick={() => router.push(`/shops/${store.id}`)}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/shops/${store.id}`)}
      role="button"
      tabIndex={0}
      initial={mounted ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay: index * 0.05 }}
      whileHover="hover"
    >
      {/* Cover band */}
      <div
        className={scss.cover}
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        {/* Decorative blur orb */}
        <div className={scss.coverOrb} />

        {/* Verified badge */}
        {store.isVerified && (
          <motion.span
            className={scss.verified}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2, ...springs.snappy }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Проверен
          </motion.span>
        )}

        {/* Logo */}
        <motion.div
          className={scss.logoWrap}
          variants={{ hover: { y: -3, scale: 1.06 } }}
          transition={springs.snappy}
        >
          {store.logo ? (
            <Image src={store.logo} alt={store.name ?? ""} width={52} height={52} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <div className={scss.logoIni}>{getInitials(store.name ?? "")}</div>
          )}
        </motion.div>
      </div>

      {/* Body */}
      <div className={scss.body}>
        <p className={scss.shopName}>{store.name}</p>

        <div className={scss.meta}>
          {store.region && (
            <span className={scss.region}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {store.region}
            </span>
          )}

          <div className={scss.stats}>
            {store.rating && (
              <span className={scss.stat}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                {store.rating}
              </span>
            )}
            {store._count?.products !== undefined && (
              <span className={scss.stat}>{store._count.products} тов.</span>
            )}
          </div>
        </div>

        <motion.div
          className={scss.arrow}
          variants={{ hover: { x: 3, opacity: 1 } }}
          initial={{ opacity: 0 }}
          transition={springs.snappy}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
};

const ShopsRow: FC = () => {
  const router = useRouter();
  const { data, isPending } = useGetShops();
  const shops = (data?.shops ?? [] as ShopSummary[]).slice(0, MAX_SHOPS);

  return (
    <div className={scss.section}>
      <div className={scss.header}>
        <h2 className={scss.title}>Магазины</h2>
        <motion.button
          className={scss.viewAll}
          onClick={() => router.push("/shops")}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          transition={springs.snappy}
        >
          Все магазины →
        </motion.button>
      </div>

      <div className={scss.scroll}>
        {isPending
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className={scss.skCard} />)
          : shops.map((store, i) => <ShopCard key={store.id} store={store as ShopSummary} index={i} />)
        }
      </div>
    </div>
  );
};

export default ShopsRow;
