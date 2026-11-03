import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Detail from "./Detail";

const addToCart = vi.fn();
const product = vi.hoisted(() => ({
  current: {} as Record<string, unknown>,
}));

vi.mock("next/navigation", async () => (await import("@/test-utils/next-mocks")).nextNavigationMock());
vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("swiper/modules", () => ({ Pagination: {} }));
vi.mock("@/hooks/useCartActions", () => ({
  useCartAddAction: () => ({ addToCart }),
  useFavoriteFun: () => ({ addToFavorite: vi.fn() }),
  useDelFavorite: () => ({ handleRemove: vi.fn() }),
}));
vi.mock("@/api/generated/endpoints/cart/cart", () => ({ useGetCart: () => ({ data: undefined }) }));
vi.mock("@/api/generated/endpoints/favorite/favorite", () => ({
  useGetFavoriteFavorites: () => ({ data: undefined }),
}));
vi.mock("@/api/generated/endpoints/product/product", () => ({
  useGetCommodityProductUserId: () => ({ data: { product: product.current }, isPending: false }),
}));

beforeEach(() => {
  addToCart.mockClear();
  product.current = {
    id: 1,
    title: "Куртка",
    description: "Тёплая куртка",
    price: "12000",
    newPrice: "9000",
    stockCount: 10,
    sizes: [],
    colors: [],
    productImages: [],
  };
});

describe("Detail", () => {
  it("shows the discount for API prices that come as strings", () => {
    render(<Detail />);

    expect(screen.getAllByText("−25%").length).toBeGreaterThan(0);
  });

  it("adds the selected quantity to the cart, not always one item", async () => {
    render(<Detail />);
    const plus = screen.getByRole("button", { name: "+" });

    await userEvent.click(plus);
    await userEvent.click(plus);
    await userEvent.click(screen.getByRole("button", { name: "Добавить в корзину" }));

    expect(addToCart).toHaveBeenCalledWith(1, 3);
  });
});
