import { Check, Minus, Plus } from 'lucide-react';
import type { Product } from '../../types';
import { money } from '../../lib/format';
import { ProductImage } from '../../components/ProductImage';

export function ProductCard({
  product,
  quantity,
  onQuantity,
}: {
  product: Product;
  quantity: number;
  onQuantity: (product: Product, quantity: number) => void;
}) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  return (
    <article
      className={`product-card ${quantity ? 'is-selected' : ''} ${product.stock === 0 ? 'is-unavailable' : ''}`}
      aria-label={product.name}
    >
      <div className="product-photo">
        <ProductImage image={product.image} name={product.name} />
        {quantity > 0 ? (
          <span className="product-tag in-order">
            <Check size={12} /> Në porosi
          </span>
        ) : (
          product.featured && <span className="product-tag">E përzgjedhur</span>
        )}
        {product.stock === 0 && <span className="unavailable-label">Përkohësisht pa stok</span>}
      </div>
      <div className="product-content">
        <div className="product-category">
          {product.category}
          <span>{product.unit}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="product-supplier">{product.supplier}</p>
        <div className={`stock ${lowStock ? 'low' : ''} ${product.stock === 0 ? 'out' : ''}`}>
          <span />
          {product.stock === 0
            ? 'Pa stok'
            : lowStock
              ? `Vetëm ${product.stock} në stok`
              : `${product.stock} në stok`}
        </div>
        <div className="product-bottom">
          <div className="product-price">
            {money(product.priceCents)}
            <small>/ {product.unit}</small>
          </div>
          {quantity > 0 ? (
            <div className="quantity-control" aria-label={`Sasia për ${product.name}`}>
              <button
                onClick={() => onQuantity(product, quantity - 1)}
                aria-label={`Zvogëlo ${product.name}`}
              >
                <Minus size={14} />
              </button>
              <span aria-label={`${quantity} njësi`}>{quantity}</span>
              <button
                onClick={() => onQuantity(product, quantity + 1)}
                disabled={quantity >= product.stock}
                aria-label={`Shto edhe një ${product.name}`}
                title={quantity >= product.stock ? 'U arrit kufiri i stokut' : 'Shto njësi'}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="add-button"
              onClick={() => onQuantity(product, 1)}
              disabled={product.stock === 0}
              aria-label={`Shto ${product.name} në porosi`}
            >
              <Plus size={16} />
              <span>Shto</span>
            </button>
          )}
        </div>
        {quantity >= product.stock && quantity > 0 && (
          <span className="stock-limit">U arrit sasia e disponueshme.</span>
        )}
      </div>
    </article>
  );
}
