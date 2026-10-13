import { create } from 'zustand';

import { getProduct, type Product } from '@/data/products';
import { type CartTotals, getCartTotals, getCouponRate } from '@/utils/cart-totals';

/**
 * Cart, favourites and coupon state (in memory). Seeded with the Figma cart (1:210) — one each
 * of the three drawn products with "Bike30" applied — so the Cart screen matches the mockup.
 */

export type CartLine = { productId: string; qty: number };

export type CartState = {
  items: CartLine[];
  /** Favourited product ids. Replaced (never mutated) so selectors re-render. */
  favourites: ReadonlySet<string>;
  /** Code as the user typed it; null when no coupon is applied. */
  couponCode: string | null;

  /** Adds a product, or bumps its quantity if it's already in the cart. */
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  increment: (productId: string) => void;
  /** Never goes below 1; use `remove` to take a line out. */
  decrement: (productId: string) => void;
  toggleFavourite: (productId: string) => void;
  /** Applies the code if valid and returns whether it was accepted. */
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  /** Empties the cart and coupon (after checkout). */
  clear: () => void;
};

const changeQty = (items: CartLine[], productId: string, delta: number) =>
  items.map((line) =>
    line.productId === productId ? { ...line, qty: Math.max(1, line.qty + delta) } : line,
  );

export const useCart = create<CartState>()((set) => ({
  items: [
    { productId: 'peugeot-lr01', qty: 1 },
    { productId: 'pilot-chromoly-520', qty: 1 },
    { productId: 'smith-trade', qty: 1 },
  ],
  favourites: new Set(['peugeot-lr01']),
  couponCode: 'Bike30',

  add: (productId, qty = 1) =>
    set(({ items }) =>
      items.some((line) => line.productId === productId)
        ? { items: changeQty(items, productId, qty) }
        : { items: [...items, { productId, qty }] },
    ),
  remove: (productId) =>
    set(({ items }) => ({ items: items.filter((line) => line.productId !== productId) })),
  increment: (productId) => set(({ items }) => ({ items: changeQty(items, productId, 1) })),
  decrement: (productId) => set(({ items }) => ({ items: changeQty(items, productId, -1) })),
  toggleFavourite: (productId) =>
    set(({ favourites }) => {
      const next = new Set(favourites);
      if (!next.delete(productId)) next.add(productId);
      return { favourites: next };
    }),
  applyCoupon: (code) => {
    const valid = getCouponRate(code) !== null;
    if (valid) set({ couponCode: code.trim() });
    return valid;
  },
  clearCoupon: () => set({ couponCode: null }),
  clear: () => set({ items: [], couponCode: null }),
}));

/** Total number of units in the cart (for badges). */
export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, line) => sum + line.qty, 0);

export type CartLineWithProduct = CartLine & { product: Product };

/** Cart lines joined with their catalog entry (unknown ids are dropped). */
export function useCartLines(): CartLineWithProduct[] {
  const items = useCart((state) => state.items);
  return items.flatMap((line) => {
    const product = getProduct(line.productId);
    return product ? [{ ...line, product }] : [];
  });
}

/** Subtotal / delivery / discount / total for the current cart and coupon. */
export function useCartTotals(): CartTotals {
  const lines = useCartLines();
  const couponCode = useCart((state) => state.couponCode);
  return getCartTotals(
    lines.map(({ product, qty }) => ({ price: product.price, qty })),
    couponCode,
  );
}
