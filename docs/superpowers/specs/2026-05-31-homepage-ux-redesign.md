# Homepage UX Redesign

**Date:** 2026-05-31  
**Status:** Approved

---

## Overview

Four interconnected UX changes to the shop frontend: removing the filter sidebar, adding a dock-style search, fixing mobile navigation, and redesigning the homepage to show shops and categories before the product grid.

---

## 1. Remove Filter Sidebar

**File:** `src/components/pages/homeSections/Welcome.tsx` + `Welcome.module.scss`

Remove the `<aside>` block entirely (price, gender, season, brand filters).  
Change layout from `grid-template-columns: 220px 1fr` to `grid-template-columns: 1fr` (single column).  
The sort tabs (Новинки / Популярные / Дешевле / Дороже) remain above the product grid.  
All filter state and handlers are removed from the component.

---

## 2. Dock Search (Desktop only)

**New file:** `src/components/layout/dockSearch/DockSearch.tsx` + `DockSearch.module.scss`

### Closed state
Fixed-position pill at `bottom: 24px; left: 50%; transform: translateX(-50%)`.  
Frosted glass: `background: rgba(255,255,255,0.95); backdrop-filter: blur(12px)`.  
Contents: purple circle icon + placeholder text "Поиск товаров" + ⌘K badge.  
Hidden on mobile (`@media max-width: 768px { display: none }`).

### Open state (Spotlight overlay)
Triggered by clicking the pill or pressing `Cmd+K`.  
Full-screen overlay: `background: rgba(15,15,25,0.45); backdrop-filter: blur(6px)`.  
Centered modal with search input + live results list.  
Results call the existing `/search` page API via `useSearchProducts` or navigate to `/search?q=...`.  
`Escape` or click-outside closes it.  
Remove the Search nav item from `Header.tsx` navItems array.

### Integration
Add `<DockSearch />` to `Layout.tsx` alongside `<Header />` and `<Mobile />`.

---

## 3. Mobile Navigation Fix

**File:** `src/components/layout/mobileNavigation/Mobile.tsx`

Replace "Избранное" slot with "Магазины":

| Before | After |
|--------|-------|
| Дом · Корзина · Каталог · Избранное · Профиль | Дом · Корзина · Каталог · Магазины · Профиль |

- "Магазины" navigates to `/shops`
- Uses the existing shop icon (SVG already in `Header.tsx`)
- "Избранное" is still accessible via the Profile page

---

## 4. Homepage Redesign

**Files:** `src/components/pages/homeSections/Welcome.tsx` + `Welcome.module.scss`  
Split into separate section components for clarity.

### Structure (top → bottom)

```
[Advertising]   ← unchanged (banner/slider)
[ShopsRow]      ← new
[CategoriesGrid] ← new
[ProductsGrid]  ← existing, now full-width, no sidebar
```

### 4a. ShopsRow

Component: `src/components/pages/homeSections/ShopsRow.tsx`  
Data: `useGetShops()` — same hook used in `Shop.tsx`.  
Layout: horizontal scroll row, `overflow-x: auto`, hidden scrollbar.  
Card (130px wide):
- Cover area (70px height, dark gradient background)
- Logo overlay: if `store.logo` → `<img>`, else initials div (same pattern as `Shop.tsx`)
- Body: shop name, star rating, product count
- Click → `router.push(\`/shops/${store.id}\`)`

Header row: "Магазины" title left + "Все магазины →" link right (→ `/shops`).  
Show max 8 shops. Skeleton: 6 placeholder cards.

### 4b. CategoriesGrid

Component: `src/components/pages/homeSections/CategoriesGrid.tsx`  
Data: `useGetCategoryCategoriesTree()` — same hook used in `Catalog.tsx`.  
Only root-level categories (no `parentId`).

**Card style — Variant A (gradient tiles):**  
Each category gets a color from a fixed palette cycled by index:

```ts
const PALETTE = [
  ['#5533EB', '#7c5ff5'],  // purple
  ['#0f172a', '#1e3a5f'],  // navy
  ['#064e3b', '#059669'],  // green
  ['#7c2d12', '#c2410c'],  // orange
  ['#1e1b4b', '#4338ca'],  // indigo
  ['#701a75', '#a21caf'],  // violet
  ['#0c4a6e', '#0284c7'],  // blue
  ['#422006', '#92400e'],  // amber-dark
]
```

Card layout:
- `border-radius: 14px`, `padding: 18px 16px`, `min-height: 88px`
- Gradient background from palette
- Two decorative pseudo-element circles (rgba white, low opacity) for depth
- Category name (white, 13px, 600)
- Subcategory count if available (white, 10px, 60% opacity)
- Click → `router.push(\`/catalog/${category.id}\`)`

Grid: `repeat(auto-fill, minmax(160px, 1fr))`, `gap: 10px`.  
Mobile: `repeat(2, 1fr)`.

### 4c. ProductsGrid (full-width)

Same `<Grid>` component, same infinite scroll, same sort tabs.  
Layout is now single-column — no sidebar, full container width.  
Sort tabs move to inline above the grid (already in place).

---

## Data Sources (all existing, no new API calls)

| Section | Hook | Already used in |
|---------|------|-----------------|
| Shops row | `useGetShops()` | `Shop.tsx` |
| Categories grid | `useGetCategoryCategoriesTree()` | `Catalog.tsx` |
| Products grid | `getCommodityProductsInfinite` | `Welcome.tsx` |
| Dock search | navigate to `/search?q=` | `Header.tsx` |

---

## Out of Scope

- Filter sidebar on category detail pages (`/catalog/[id]`) — not touched
- Favorites page — not touched
- Search results page (`/search`) — not touched, dock just navigates there
