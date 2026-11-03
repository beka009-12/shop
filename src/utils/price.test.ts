import { describe, expect, it } from "vitest";
import { getDiscountPercent, getEffectivePrice } from "./price";

describe("getDiscountPercent", () => {
  it("compares API string prices numerically", () => {
    expect(getDiscountPercent("12000", "9000")).toBe(25);
  });

  it("is 0 without a discounted price", () => {
    expect(getDiscountPercent("1000", null)).toBe(0);
    expect(getDiscountPercent(1000, undefined)).toBe(0);
  });

  it("is 0 when the discounted price is not lower", () => {
    expect(getDiscountPercent("1000", "1000")).toBe(0);
    expect(getDiscountPercent("1000", "1200")).toBe(0);
  });
});

describe("getEffectivePrice", () => {
  it("uses the discounted price when present", () => {
    expect(getEffectivePrice("1000", "800")).toBe(800);
  });

  it("falls back to the regular price", () => {
    expect(getEffectivePrice("1000", null)).toBe(1000);
  });

  it("treats missing prices as 0 instead of NaN", () => {
    expect(getEffectivePrice(undefined, undefined)).toBe(0);
  });
});
