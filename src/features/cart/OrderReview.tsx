import { ArrowDownToLine, ArrowRight, Check, CircleCheck, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/Modal';
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
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="modal-intro">Një kontroll i fundit për Market Tilia.</p>
      <div className="review-items">
        {items.map(({ product, quantity }) => (
          <div key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <span>
                {quantity} × {money(product.priceCents)} / {product.unit}
              </span>
            </div>
            <strong>{money(product.priceCents * quantity)}</strong>
          </div>
        ))}
      </div>
      <div className="review-total">
        <span>Totali</span>
        <strong>{money(cartTotal(items))}</strong>
      </div>
      <div className="inline-note">
        <CircleCheck size={17} />
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
    </Modal>
  );
}

export function OrderSuccess({ order, onClose }: { order: Order; onClose: () => void }) {
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
    <Modal title="Porosia u përgatit" onClose={onClose}>
      <div className="success-body">
        <span className="success-icon">
          <Check size={34} />
        </span>
        <span className="eyebrow">GJITHÇKA NË RREGULL</span>
        <h3>Gati për një fillim të mbarë.</h3>
        <p>
          Porosia juaj demo u konfirmua.
          <br />
          Mund ta shkarkoni përmbledhjen më poshtë.
        </p>
        <div className="order-receipt">
          <span>{order.id}</span>
          <strong>{money(order.totalCents)}</strong>
          <small>
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} njësi të përzgjedhura
          </small>
        </div>
      </div>
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
