import { describe, expect, it } from 'vitest';
import { parseProducts } from './api';
import { normalize } from '../../lib/format';
import products from '../../../public/data/products.json';

describe('catalog boundary', () => {
  it('validates the actual bundled catalog', () => {
    expect(parseProducts(products)).toHaveLength(18);
    expect(new Set(products.map((p) => p.category)).size).toBe(6);
  });
  it('rejects wrong shapes, duplicates, invalid prices, stock and images', () => {
    const p = products[0];
    for (const data of [
      {},
      [null],
      [p, p],
      [{ ...p, priceCents: 1.25 }],
      [{ ...p, stock: -1 }],
      [{ ...p, stock: '4' }],
      [{ ...p, image: 'javascript:alert(1)' }],
    ]) {
      expect(() => parseProducts(data)).toThrow();
    }
  });
  it('lets Albanian users search without accents', () => {
    expect(normalize('  Qumësht i freskët ')).toBe('qumesht i fresket');
    expect(normalize('Çaj')).toBe('caj');
  });
});
