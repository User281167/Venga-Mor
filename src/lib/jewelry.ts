export const JEWELRY_PACKAGES = [
  { quantity: 10, price: 0.99 },
  { quantity: 50, price: 4.99 },
  { quantity: 120, price: 9.99 },
  { quantity: 250, price: 19.99 },
] as const;

export type JewelryPackage = (typeof JEWELRY_PACKAGES)[number];

export const JEWELRY_QUANTITY_TO_PRICE = new Map(
  JEWELRY_PACKAGES.map((pkg) => [pkg.quantity, pkg.price]),
);

export const JEWELRY_PRICE_TO_QUANTITY = new Map(
  JEWELRY_PACKAGES.map((pkg) => [pkg.price.toFixed(2), pkg.quantity]),
);

export function getJewelryPackageByQuantity(quantity: number) {
  return JEWELRY_PACKAGES.find((pkg) => pkg.quantity === quantity);
}

export function getJewelryQuantityByPrice(price: string | number) {
  const normalized =
    typeof price === "number" ? price.toFixed(2) : Number(price).toFixed(2);

  return JEWELRY_PRICE_TO_QUANTITY.get(normalized) ?? null;
}
