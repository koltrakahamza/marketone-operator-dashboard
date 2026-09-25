import type { DemoMode, Product } from '../../types';

export function parseProducts(data: unknown): Product[] {
  if (!Array.isArray(data)) throw new Error('Katalogu ka një format të pavlefshëm.');
  const ids = new Set<string>();
  return data.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Produkti është i pavlefshëm.');
    const p = item as Record<string, unknown>;
    if (
      typeof p.id !== 'string' ||
      !/^p\d{2}$/.test(p.id) ||
      ids.has(p.id) ||
      !['name', 'category', 'unit', 'supplier', 'image'].every(
        (key) => typeof p[key] === 'string' && (p[key] as string).trim(),
      ) ||
      !(p.image as string).startsWith('/images/') ||
      typeof p.priceCents !== 'number' ||
      !Number.isSafeInteger(p.priceCents) ||
      p.priceCents <= 0 ||
      typeof p.stock !== 'number' ||
      !Number.isSafeInteger(p.stock) ||
      p.stock < 0 ||
      (p.featured !== undefined && typeof p.featured !== 'boolean')
    ) {
      throw new Error('Të dhënat e katalogut janë të paplota.');
    }
    ids.add(p.id);
    return p as unknown as Product;
  });
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, ms);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}

export async function fetchProducts(mode: DemoMode, signal: AbortSignal): Promise<Product[]> {
  await delay(mode === 'loading' ? 8000 : 500, signal);
  if (mode === 'error') throw new Error('Nuk mundëm të ngarkojmë produktet. Provo përsëri.');
  if (mode === 'empty') return [];
  const response = await fetch(`${import.meta.env.BASE_URL}data/products.json`, { signal });
  if (!response.ok) throw new Error('Katalogu nuk është i disponueshëm për momentin.');
  return parseProducts(await response.json());
}
