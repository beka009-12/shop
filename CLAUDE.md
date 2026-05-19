# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server with Turbopack on localhost:3000
bun build        # Production build
bun lint         # ESLint check
bun generate-api # Regenerate API client from OpenAPI spec (requires backend at localhost:5003)
```

> No test suite is configured. There is no `bun test` command.

## Architecture

This is a Next.js 15 (App Router) e-commerce marketplace frontend called **Zest / Onekg**.

### Routing

Uses route groups under `src/app/`:
- `(auth)/auth` — login/register page
- `(site)/` — all main pages (home, catalog, product detail, cart, favorites, profile, shops) wrapped by `Layout` (header + footer + mobile nav)

### API Layer

All API calls go through an **Orval-generated React Query client** in `src/api/generated/`. The generator reads the OpenAPI spec from `http://localhost:5003/docs-json` and splits output by tags into `endpoints/` (hooks) and `models/` (TypeScript types).

The custom Axios instance lives at `src/api/index.ts`. It:
- Uses `NEXT_PUBLIC_API` env var as base URL with `/nest-shop` prefix
- Reads auth token from `localStorage` (`token` key) and attaches as `Bearer` header

**Do not hand-write API calls.** Always use the generated hooks from `src/api/generated/endpoints/<tag>/<tag>.ts`. After backend changes, run `bun generate-api` to regenerate.

### State & Data Fetching

- **Server state:** TanStack Query v5. The `QueryClient` is instantiated in `Provider.tsx` (client component wrapping the whole app).
- **Shared action hooks:** `src/hooks/useCartActions.ts` — reusable hooks for cart and favorites mutations with `toast.promise` feedback and query invalidation. Prefer extending this file over duplicating cart/favorite logic in pages.
- **No global client state manager** (no Redux/Zustand store currently in use).

### Styling

- **CSS Modules + SCSS** per component (e.g., `Header.module.scss` alongside `Header.tsx`).
- No Tailwind — the global CSS is in `src/app/globals.css`.
- Design system accent: `#5533EB`.

### UI Conventions

- Shared UI primitives live under `src/utils/ui/` — cards, skeletons, search, global button, empty-state notes.
- Skeleton components (e.g., `CardSceleton`, `DetailSceleton`) are used for loading states — prefer these over spinners.
- `lucide-react` for icons, `framer-motion` for animations, `swiper` for carousels, `react-hot-toast` for notifications.

### Images

Images are served from Supabase Storage (`epuxbmygkqcjnqokjmvw.supabase.co`). The `next/image` remote pattern is already configured in `next.config.ts`.

## Environment Variables

```
NEXT_PUBLIC_API=  # Base URL of the NestJS backend (e.g. http://localhost:5003)
```
