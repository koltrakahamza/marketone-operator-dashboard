import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useId } from 'react';
import type { Cart, Product } from '../../types';
import { money } from '../../lib/format';
import { ProductImage } from '../../components/ProductImage';
import { cartItems, cartTotal } from './cart';

export function CartPanel({
  products,
  cart,
  onQuantity,
  onClear,
  onReview,
  ready,
}: {
  products: Product[];
  cart: Cart;
  onQuantity: (product: Product, quantity: number) => void;
  onClear: () => void;
  onReview: () => void;
  ready: boolean;
}) {
  const headingId = useId();
  const items = cartItems(cart, products);
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <section className="cart-panel" aria-label="Përmbledhja e porosisë">
      <div className="cart-heading">
        <span className="cart-heading-icon">
          <ShoppingBag size={20} />
        </span>
        <div>
          <h2 id={headingId}>Porosia juaj</h2>
          <p>
            {units ? `${units} njësi · ${items.length} produkte` : 'Një fillim i mirë për marketin'}
          </p>
        </div>
        <span className="cart-count">{units}</span>
      </div>
      <div className="cart-store">
        <span className="store-monogram">M</span>
        <div>
          <strong>Market Tilia</strong>
          <span>Tiranë, Shqipëri</span>
        </div>
        <span className="store-status">
          <Check size={12} />
        </span>
      </div>
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="bag-illustration">
            <span className="bag-circle" />
            <ShoppingBag size={48} strokeWidth={1.15} />
            <span className="bag-spark one">+</span>
            <span className="bag-spark two">✳</span>
            <span className="bag-spark three">·</span>
          </div>
          <h3>Çfarë do të porosisim sot?</h3>
          <p>
            Zgjidhni produktet nga katalogu.
            <br />
            Ne kujdesemi për përmbledhjen.
          </p>
          <span className="empty-cart-arrow" aria-hidden="true">
            ←
          </span>
        </div>
      ) : (
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div className="cart-item" key={product.id}>
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
                      <Minus size={13} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label={`Rrit sasinë e ${product.name}`}
                      onClick={() => onQuantity(product, quantity + 1)}
                      disabled={quantity >= product.stock}
                      title={quantity >= product.stock ? 'U arrit kufiri i stokut' : 'Shto njësi'}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <strong>{money(product.priceCents * quantity)}</strong>
                </div>
                {quantity >= product.stock && (
                  <small className="cart-stock-limit">Maksimumi në stok</small>
                )}
              </div>
              <button
                className="remove-item"
                aria-label={`Hiq ${product.name} nga porosia`}
                onClick={() => onQuantity(product, 0)}
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="cart-summary">
        <div className="cart-subtotal">
          <span>Nëntotali</span>
          <span>{money(cartTotal(items))}</span>
        </div>
        <div className="cart-total">
          <span>Totali i porosisë</span>
          <strong data-testid="cart-total">{money(cartTotal(items))}</strong>
        </div>
        <p className="cart-price-note">Totali përfshin vetëm produktet e përzgjedhura.</p>
        <button
          className="button primary review-button"
          disabled={!items.length || !ready}
          onClick={onReview}
        >
          Rishiko porosinë <ArrowRight size={17} />
        </button>
        {items.length > 0 && (
          <button className="clear-cart" onClick={onClear}>
            <Trash2 size={13} /> Zbraz porosinë
          </button>
        )}
      </div>
      <p className="cart-demo-note">
        <span /> Porosi demo · Asnjë pagesë reale
      </p>
    </section>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
