import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { Provider } from "./Provider";

vi.mock("@tanstack/react-query-devtools", () => ({ ReactQueryDevtools: () => null }));
vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("Provider", () => {
  it("keeps one QueryClient across re-renders so cached queries survive", () => {
    const seen: QueryClient[] = [];
    const Probe = () => {
      seen.push(useQueryClient());
      return null;
    };

    const { rerender } = render(
      <Provider>
        <Probe />
      </Provider>,
    );
    rerender(
      <Provider>
        <Probe />
      </Provider>,
    );

    expect(seen).toHaveLength(2);
    expect(seen[1]).toBe(seen[0]);
  });
});
