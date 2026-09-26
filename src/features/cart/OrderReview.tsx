import { ArrowDownToLine, ArrowRight, Check, CircleCheck, LoaderCircle, Store } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { ProductImage } from '../../components/ProductImage';
import { Brand } from '../../components/Brand';
import type { Order, Product } from '../../types';
import { money } from '../../lib/format';
import { cartTotal } from './cart';

export function OrderReview({
  items,
  onClose,
  onConfirm,
}: {
  items: { product: Product; quantity: number }[];
  onClose: () => void;
  onConfirm: (order: Order) => void;
}) {
  const [busy, setBusy] = useState(false);
  const units = items.reduce((sum, item) => sum + item.quantity, 0);

  async function confirm() {
    if (busy || !items.length) return;
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    onConfirm({
      id: `MO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items,
      totalCents: cartTotal(items),
    });
  }

  return (
    <Modal
      title="Rishikoni porosinë"
      className="order-review-modal"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="modal-intro">Gjithçka gati? Hidhini edhe një sy përzgjedhjes suaj.</p>
      <div className="review-store">
        <span>
          <Store size={20} />
        </span>
        <div>
          <strong>Market Tilia</strong>
          <small>Tiranë, Shqipëri</small>
        </div>
        <span className="demo-badge">Porosi demo</span>
      </div>
      <div className="review-section-heading">
        <h3>Përzgjedhja juaj</h3>
        <span>
          {items.length} {items.length === 1 ? 'produkt' : 'produkte'} · {units} njësi
        </span>
      </div>
      <ul className="review-items">
        {items.map(({ product, quantity }) => (
          <li key={product.id}>
            <ProductImage image={product.image} name={product.name} />
            <div>
              <strong>{product.name}</strong>
              <span>
                {quantity} × {money(product.priceCents)} / {product.unit}
              </span>
            </div>
            <strong>{money(product.priceCents * quantity)}</strong>
          </li>
        ))}
      </ul>
      <div className="review-total">
        <div>
          <span>Totali i porosisë</span>
          <small>{units} njësi të përzgjedhura</small>
        </div>
        <strong>{money(cartTotal(items))}</strong>
      </div>
      <div className="inline-note">
        <CircleCheck size={18} />
        <p>Kjo është një porosi demonstrimi. Nuk dërgohet te furnitorët dhe nuk kryhet pagesë.</p>
      </div>
      <button
        className="button primary full-width"
        disabled={busy || !items.length}
        onClick={confirm}
      >
        {busy ? (
          <>
            <LoaderCircle size={17} className="spin" /> Duke konfirmuar…
          </>
        ) : (
          <>
            Konfirmo porosinë demo <Check size={17} />
          </>
        )}
      </button>
      <button className="button text-button full-width" disabled={busy} onClick={onClose}>
        Kthehu për të ndryshuar porosinë
      </button>
    </Modal>
  );
}

export function OrderSuccess({ order, onClose }: { order: Order; onClose: () => void }) {
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdAt = new Intl.DateTimeFormat('sq-AL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(order.createdAt));

  function download() {
    const text = [
      'MARKETONE — POROSI DEMO',
      order.id,
      new Date(order.createdAt).toLocaleString('sq-AL'),
      'Market Tilia · Tiranë',
      '',
      ...order.items.map(
        ({ product, quantity }) =>
          `${product.name} — ${quantity} × ${money(product.priceCents)} = ${money(product.priceCents * quantity)}`,
      ),
      '',
      `TOTALI: ${money(order.totalCents)}`,
      '',
      'Vetëm demonstrim. Nuk është faturë apo porosi reale.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${order.id}.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Modal title="Porosia u përgatit" className="order-success-modal" onClose={onClose}>
      <div className="success-body">
        <span className="success-icon">
          <Check size={28} />
        </span>
        <h3>Një porosi. Gjithçka në vend.</h3>
        <p>Përmbledhja juaj është gati për t’u shkarkuar.</p>
      </div>
      <section className="order-receipt" aria-label="Mandati i porosisë demo">
        <div className="receipt-brand">
          <Brand />
          <span>
            <Check size={13} /> Konfirmuar · demo
          </span>
        </div>
        <dl className="receipt-details">
          <div>
            <dt>Porosia</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>{createdAt}</dd>
          </div>
          <div>
            <dt>Marketi</dt>
            <dd>Market Tilia, Tiranë</dd>
          </div>
        </dl>
        <ul className="receipt-lines">
          {order.items.map(({ product, quantity }) => (
            <li key={product.id}>
              <span>
                <b>{quantity}×</b> {product.name}
              </span>
              <strong>{money(product.priceCents * quantity)}</strong>
            </li>
          ))}
        </ul>
        <div className="receipt-total">
          <div>
            <span>Totali i porosisë</span>
            <small>
              {units} njësi · {order.items.length}{' '}
              {order.items.length === 1 ? 'produkt' : 'produkte'}
            </small>
          </div>
          <strong>{money(order.totalCents)}</strong>
        </div>
        <p className="receipt-note">Vetëm për demonstrim. Nuk është faturë.</p>
      </section>
      <button className="button primary full-width" onClick={download}>
        <ArrowDownToLine size={17} /> Shkarko përmbledhjen
      </button>
      <button className="button text-button full-width" onClick={onClose}>
        Vazhdo te produktet <ArrowRight size={16} />
      </button>
      <p className="success-disclaimer">Nuk është kryer asnjë pagesë apo porosi reale.</p>
    </Modal>
  );
}
