import { useEffect, useRef } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../../types';
import { money } from '../../lib/format';
import { ProductImage } from '../../components/ProductImage';

export function CartLine({
  product,
  quantity,
  onQuantity,
}: {
  product: Product;
  quantity: number;
  onQuantity: (product: Product, quantity: number) => void;
}) {
  const line = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = line.current?.animate(
      [{ backgroundColor: '#e9f1df' }, { backgroundColor: '#ffffff' }],
      { duration: 650, easing: 'ease-out' },
    );
    return () => animation?.cancel();
  }, [quantity]);

  return (
    <div ref={line} className="cart-item">
      <ProductImage image={product.image} name={product.name} />
      <div className="cart-item-info">
        <h3>{product.name}</h3>
        <span>
          {money(product.priceCents)} / {product.unit}
        </span>
        <div className="cart-item-bottom">
          <div className="quantity-control">
            <button
              aria-label={`Ul sasinë e ${product.name}`}
              onClick={() => onQuantity(product, quantity - 1)}
            >
              <Minus size={14} />
            </button>
            <span>{quantity}</span>
            <button
              aria-label={`Rrit sasinë e ${product.name}`}
              onClick={() => onQuantity(product, quantity + 1)}
              disabled={quantity >= product.stock}
              title={quantity >= product.stock ? 'U arrit kufiri i stokut' : 'Shto njësi'}
            >
              <Plus size={14} />
            </button>
          </div>
          <strong>
            <span key={quantity} className="amount-change">
              {money(product.priceCents * quantity)}
            </span>
          </strong>
        </div>
        {quantity >= product.stock && <small className="cart-stock-limit">Maksimumi në stok</small>}
      </div>
      <button
        className="remove-item"
        aria-label={`Hiq ${product.name} nga porosia`}
        onClick={() => onQuantity(product, 0)}
      >
        <X size={15} />
      </button>
    </div>
  );
}
