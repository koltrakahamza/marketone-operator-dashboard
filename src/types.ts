export interface Product {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  stock: number;
  unit: string;
  supplier: string;
  image: string;
  featured?: boolean;
}

export type Cart = Record<string, number>;
export type DemoMode = 'normal' | 'loading' | 'error' | 'empty';
export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; products: Product[] };

export interface Order {
  id: string;
  createdAt: string;
  items: { product: Product; quantity: number }[];
  totalCents: number;
}
