import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Order from "./Order";

const updateQuantity = vi.fn();
// React Query returns a stable `data` reference between renders; a fresh object each call would loop forever
const cartQuery = vi.hoisted(() => ({
  isLoading: false,
  data: {
    items: [
      { id: 10, quantity: 2, product: { id: 1, title: "Куртка", price: "1000", newPrice: "800" } },
    ],
  },
}));

vi.mock("next/navigation", async () => (await import("@/test-utils/next-mocks")).nextNavigationMock());
vi.mock("next/image", async () => (await import("@/test-utils/next-mocks")).nextImageMock());
vi.mock("@/api/generated/endpoints/cart/cart", () => ({
  getGetCartQueryKey: () => ["/cart"],
  useGetCart: () => cartQuery,
  useDeleteCartClear: () => ({ mutate: vi.fn() }),
  useDeleteCartProductId: () => ({ mutate: vi.fn() }),
  usePatchCartProductId: () => ({ mutate: updateQuantity }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

const amount = (value: number) => new RegExp(`^${value.toLocaleString().replace(/\s/g, "\\s")} сом$`);

beforeEach(() => updateQuantity.mockClear());

describe("Order (cart page)", () => {
  it("totals the cart with the discounted price the backend will charge", () => {
    render(<Order />, { wrapper });

    expect(screen.getAllByText(amount(1600)).length).toBeGreaterThan(0);
    expect(screen.queryByText(amount(2000))).not.toBeInTheDocument();
  });

  it("saves a quantity change to the server cart", async () => {
    render(<Order />, { wrapper });

    await userEvent.click(screen.getByRole("button", { name: "Увеличить" }));

    expect(updateQuantity).toHaveBeenCalledWith({ productId: 1, data: { quantity: 3 } });
  });
});
