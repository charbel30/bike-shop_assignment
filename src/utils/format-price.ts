/** Currency formatting matching the Figma copy ("$ 1,999.99", "$ 120", "$0"). */

const withCents = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const wholeDollars = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export type FormatPriceOptions = {
  /** Space after the "$", as on product cards and the detail screen ("$ 1,999.99"). */
  spaced?: boolean;
};

/** Whole amounts drop the cents ("$ 120"), everything else shows two decimals. */
export function formatPrice(amount: number, { spaced = false }: FormatPriceOptions = {}) {
  const rounded = Math.round(amount * 100) / 100;
  const digits = Number.isInteger(rounded) ? wholeDollars.format(rounded) : withCents.format(rounded);
  return `$${spaced ? ' ' : ''}${digits}`;
}

/** 0.3 → "30%". */
export function formatPercent(rate: number) {
  return `${Math.round(rate * 100)}%`;
}
