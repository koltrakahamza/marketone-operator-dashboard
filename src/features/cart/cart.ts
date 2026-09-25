import type { Cart, Product } from '../../types';

export type CartAction =
  | { type: 'set'; product: Product; quantity: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'reconcile'; products: Product[] };

export function sanitizeCart(value: unknown): Cart {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([id, count]) =>
        /^p\d{2}$/.test(id) &&
        typeof count === 'number' &&
        Number.isSafeInteger(count) &&
        count > 0,
    ),
  );
}

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'clear':
      return {};
    case 'remove':
      return Object.fromEntries(Object.entries(state).filter(([id]) => id !== action.id));
    case 'reconcile':
      return Object.fromEntries(
        action.products.flatMap((product) => {
          const quantity = Math.min(state[product.id] ?? 0, product.stock);
          return quantity > 0 ? [[product.id, quantity]] : [];
        }),
      );
    case 'set': {
      if (!Number.isSafeInteger(action.quantity)) return state;
      const quantity = Math.max(0, Math.min(action.quantity, action.product.stock));
      if (quantity === 0) return cartReducer(state, { type: 'remove', id: action.product.id });
      return { ...state, [action.product.id]: quantity };
    }
  }
}

export function cartItems(cart: Cart, products: Product[]) {
  return products.flatMap((product) => {
    const quantity = Math.min(cart[product.id] ?? 0, product.stock);
    return quantity > 0 ? [{ product, quantity }] : [];
  });
}

export const cartTotal = (items: ReturnType<typeof cartItems>) =>
  items.reduce((total, { product, quantity }) => total + product.priceCents * quantity, 0);
