// The API serialises Prisma Decimal as strings ("12000"), so prices must be converted
// before any comparison: "12000" > "9000" is false as strings.
export type ApiAmount = number | string | null | undefined;

const toNumber = (value: ApiAmount): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const hasValue = (value: ApiAmount): value is number | string =>
  value !== null && value !== undefined && value !== "";

export const getEffectivePrice = (price: ApiAmount, newPrice: ApiAmount): number =>
  hasValue(newPrice) ? toNumber(newPrice) : toNumber(price);

export const getDiscountPercent = (price: ApiAmount, newPrice: ApiAmount): number => {
  if (!hasValue(newPrice)) return 0;
  const regular = toNumber(price);
  const discounted = toNumber(newPrice);
  if (discounted <= 0 || discounted >= regular) return 0;
  return Math.round(((regular - discounted) / regular) * 100);
};
