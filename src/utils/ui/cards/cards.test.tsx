import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Cards from "./Cards";

vi.mock("next/navigation", async () => (await import("@/test-utils/next-mocks")).nextNavigationMock());
vi.mock("next/image", async () => (await import("@/test-utils/next-mocks")).nextImageMock());
vi.mock("@/hooks/useCartActions", () => ({
  useCartAddAction: () => ({ addToCart: vi.fn() }),
  useFavoriteFun: () => ({ addToFavorite: vi.fn() }),
  useDelFavorite: () => ({ handleRemove: vi.fn() }),
}));
vi.mock("@/api/generated/endpoints/cart/cart", () => ({ useGetCart: () => ({ data: undefined }) }));
vi.mock("@/api/generated/endpoints/favorite/favorite", () => ({
  useGetFavoriteFavorites: () => ({ data: undefined }),
}));

// The API serialises Prisma Decimal as strings ("12000"), even though the generated types say number
const apiPrice = (value: string) => value as unknown as number;

describe("Cards", () => {
  it("shows the discount badge when the price has more digits than the discounted price", () => {
    render(<Cards id={1} title="Куртка" price={apiPrice("12000")} newPrice={apiPrice("9000")} />);

    expect(screen.getByText("−25%")).toBeInTheDocument();
  });

  it("shows no badge when there is no discount", () => {
    render(<Cards id={1} title="Куртка" price={apiPrice("12000")} newPrice={null} />);

    expect(screen.queryByText(/−\d+%/)).not.toBeInTheDocument();
  });
});
