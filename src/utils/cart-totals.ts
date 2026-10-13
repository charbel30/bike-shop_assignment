/**
 * Pure cart maths. Amounts are summed in integer cents so totals never drift
 * (Figma: subtotal $6,119.99, 30% off, total $4,283.99).
 */

/** Orders whose subtotal reaches this ship free ("Your cart qualifies for free shipping"). */
export const FREE_SHIPPING_THRESHOLD = 500;
/** Flat delivery fee below the threshold. */
export const DELIVERY_FEE = 25;

/** Coupon codes (matched case-insensitively) → discount rate on the subtotal. */
export const COUPONS: Readonly<Record<string, number>> = { BIKE30: 0.3 };

export type PricedLine = { price: number; qty: number };

export type CartTotals = {
  subtotal: number;
  deliveryFee: number;
  qualifiesForFreeShipping: boolean;
  /** How much more to spend for free shipping (0 once qualified). */
  amountToFreeShipping: number;
  /** 0 when no valid coupon is applied. */
  discountRate: number;
  discountAmount: number;
  total: number;
};

const toCents = (amount: number) => Math.round(amount * 100);
const fromCents = (cents: number) => cents / 100;

export function normalizeCoupon(code: string) {
  return code.trim().toUpperCase();
}

/** Discount rate for a code, or null if it isn't a valid coupon. */
export function getCouponRate(code: string | null | undefined): number | null {
  if (!code) return null;
  return COUPONS[normalizeCoupon(code)] ?? null;
}

export function getCartTotals(lines: readonly PricedLine[], couponCode?: string | null): CartTotals {
  const subtotalCents = lines.reduce((sum, line) => sum + toCents(line.price) * line.qty, 0);
  const thresholdCents = toCents(FREE_SHIPPING_THRESHOLD);
  // An empty cart has nothing to ship, so it neither pays nor "qualifies".
  const qualifiesForFreeShipping = subtotalCents >= thresholdCents;
  const deliveryCents = subtotalCents === 0 || qualifiesForFreeShipping ? 0 : toCents(DELIVERY_FEE);
  const discountRate = getCouponRate(couponCode) ?? 0;
  const discountCents = Math.round(subtotalCents * discountRate);

  return {
    subtotal: fromCents(subtotalCents),
    deliveryFee: fromCents(deliveryCents),
    qualifiesForFreeShipping,
    amountToFreeShipping: fromCents(Math.max(thresholdCents - subtotalCents, 0)),
    discountRate,
    discountAmount: fromCents(discountCents),
    total: fromCents(subtotalCents - discountCents + deliveryCents),
  };
}
