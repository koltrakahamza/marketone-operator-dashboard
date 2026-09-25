import { describe, expect, it } from 'vitest';
import { cartItems, cartReducer, cartTotal, sanitizeCart } from './cart';
import type { Product } from '../../types';

const product: Product = {
  id: 'p01',
  name: 'Domate',
  category: 'Fruta',
  priceCents: 190,
  stock: 4,
  unit: 'kg',
  supplier: 'Farma',
  image: '/images/p01.jpg',
};

describe('order quantities and money', () => {
  it('caps quantities at stock, including stale browser state', () => {
    expect(cartReducer({}, { type: 'set', product, quantity: 9 })).toEqual({ p01: 4 });
    expect(cartItems({ p01: 999 }, [product])[0].quantity).toBe(4);
    expect(cartReducer({ p01: 9, p02: 2 }, { type: 'reconcile', products: [product] })).toEqual({
      p01: 4,
    });
  });
  it('does not add unavailable products or accept fractional/non-finite quantities', () => {
    expect(
      cartReducer({}, { type: 'set', product: { ...product, stock: 0 }, quantity: 1 }),
    ).toEqual({});
    for (const quantity of [1.5, NaN, Infinity])
      expect(cartReducer({}, { type: 'set', product, quantity })).toEqual({});
  });
  it('removes a line at zero, and can clear or remove independently', () => {
    expect(cartReducer({ p01: 2 }, { type: 'set', product, quantity: 0 })).toEqual({});
    expect(cartReducer({ p01: 2, p02: 1 }, { type: 'remove', id: 'p01' })).toEqual({ p02: 1 });
    expect(cartReducer({ p01: 2 }, { type: 'clear' })).toEqual({});
  });
  it('calculates exact integer-cent totals', () => {
    const items = cartItems({ p01: 3, p02: 2 }, [
      product,
      { ...product, id: 'p02', priceCents: 145 },
    ]);
    expect(cartTotal(items)).toBe(860);
    expect(cartTotal([])).toBe(0);
  });
  it('rejects malformed persisted carts and dangerous property names', () => {
    expect(sanitizeCart(null)).toEqual({});
    expect(sanitizeCart([1])).toEqual({});
    expect(
      sanitizeCart(JSON.parse('{"p01":2,"p02":-1,"p03":1.2,"p04":"4","__proto__":8}')),
    ).toEqual({ p01: 2 });
  });
});
