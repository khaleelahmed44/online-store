import { LEGACY_USD_PRICE_THRESHOLD, USD_TO_PKR } from './constants';

/** Normalize stored price to PKR (handles legacy USD seed data). */
export function normalizeToPKR(price: number): number {
  if (price > 0 && price < LEGACY_USD_PRICE_THRESHOLD) {
    return Math.round(price * USD_TO_PKR);
  }
  return Math.round(price);
}

export function formatPrice(amount: number): string {
  const pkr = normalizeToPKR(amount);
  return `Rs. ${pkr.toLocaleString('en-PK')}`;
}

export function getSalePrice(price: number, salePercentage: number): number {
  const pkr = normalizeToPKR(price);
  return Math.round(pkr * (1 - salePercentage / 100));
}
