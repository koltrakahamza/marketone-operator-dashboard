import { useEffect, useReducer, useState } from 'react';
import {
  ArrowRight,
  Asterisk,
  Check,
  ChevronRight,
  Leaf,
  LogOut,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { Brand } from './components/Brand';
import { Sidebar } from './components/Sidebar';
import { Modal } from './components/Modal';
import { DemoDialog } from './components/DemoDialog';
import { Login } from './features/auth/Login';
import { Catalog } from './features/products/Catalog';
import { useProducts } from './features/products/useProducts';
import { CartPanel } from './features/cart/CartPanel';
import { OrderReview, OrderSuccess } from './features/cart/OrderReview';
import { cartItems, cartReducer, cartTotal, sanitizeCart } from './features/cart/cart';
import { readSession, removeSession, saveSession } from './lib/storage';
import { money } from './lib/format';
import type { DemoMode, Order, Product } from './types';

const SESSION_KEY = 'marketone.demo.session.v1';
const CART_KEY = 'marketone.demo.cart.v1';
type Dialog = 'cart' | 'review' | 'success' | 'clear' | 'help' | 'demo' | 'logout' | null;

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => readSession(SESSION_KEY) === true);
  if (!loggedIn)
    return (
      <Login
        onLogin={() => {
          saveSession(SESSION_KEY, true);
          setLoggedIn(true);
        }}
      />
    );
  return (
    <Dashboard
      onLogout={() => {
        removeSession(SESSION_KEY);
        removeSession(CART_KEY);
        setLoggedIn(false);
      }}
    />
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [mode, setMode] = useState<DemoMode>('normal');
  const { state, retry } = useProducts(mode);
  const [cart, dispatch] = useReducer(cartReducer, undefined, () =>
    sanitizeCart(readSession(CART_KEY)),
  );
  const [lastProducts, setLastProducts] = useState<Product[]>([]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState('');
  const products = state.status === 'success' && mode !== 'empty' ? state.products : lastProducts;
  const items = cartItems(cart, products);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal(items);
  const ready = state.status === 'success' && mode !== 'empty';

  useEffect(() => {
    saveSession(CART_KEY, cart);
  }, [cart]);
  useEffect(() => {
    if (state.status === 'success' && mode !== 'empty') {
      setLastProducts(state.products);
      dispatch({ type: 'reconcile', products: state.products });
    }
  }, [state, mode]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  function changeQuantity(product: Product, quantity: number) {
    const wasEmpty = !cart[product.id];
    dispatch({ type: 'set', product, quantity });
    if (wasEmpty && quantity > 0) setToast(`${product.name} u shtua në porosi.`);
  }
  function retryCatalog() {
    if (mode !== 'normal') setMode('normal');
    else retry();
  }
  const cartPanel = (
    <CartPanel
      cart={cart}
      products={products}
      onQuantity={changeQuantity}
      onClear={() => setDialog('clear')}
      onReview={() => setDialog('review')}
      ready={ready}
    />
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Kalo te përmbajtja
      </a>
      <Sidebar
        count={count}
        onCart={() => setDialog('cart')}
        onHelp={() => setDialog('help')}
        onDemo={() => setDialog('demo')}
        onLogout={() => setDialog('logout')}
      />
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <div className="breadcrumb">
            <Store size={15} />
            <span>Hapësira e operatorit</span>
            <ChevronRight size={13} />
            <strong>Produktet</strong>
          </div>
          <div className="topbar-right">
            <button className="demo-badge" onClick={() => setDialog('demo')}>
              <span /> Version demo
            </button>
            <span className="topbar-divider" />
            <span className="topbar-greeting">
              Mirë se erdhët, <strong>Arta</strong>
            </span>
            <span className="avatar">AT</span>
            <button
              className="icon-button mobile-logout"
              aria-label="Dil nga llogaria"
              onClick={() => setDialog('logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main id="main" className="main-content">
          <section className="page-heading">
            <div>
              <span className="eyebrow">PAK MË THJESHTË, ÇDO DITË</span>
              <h1>
                Gjithçka për marketin tuaj<span>.</span>
              </h1>
              <p>Produkte të përzgjedhura. Porosi të lehta. Më shumë kohë për biznesin.</p>
            </div>
            <div className="heading-mark" aria-hidden="true">
              <Leaf size={27} strokeWidth={1.2} />
            </div>
          </section>
          <div className="dashboard-columns">
            <div className="catalog-column">
              <section className="catalog-intro" aria-label="Përzgjedhja e MarketOne">
                <span className="intro-leaf">
                  <Leaf size={24} strokeWidth={1.5} />
                </span>
                <div>
                  <h2>Produkte të mira. Porosi të thjeshta.</h2>
                  <p>
                    {state.status === 'success'
                      ? `${state.products.length} produkte · ${new Set(state.products.map((product) => product.category)).size} kategori`
                      : 'Përzgjedhja për marketin tuaj'}{' '}
                    <span>· Çdo ditë, në një vend.</span>
                  </p>
                </div>
                <span className="intro-mark" aria-hidden="true">
                  <Asterisk size={38} strokeWidth={1.4} />
                </span>
              </section>
              {mode !== 'normal' && (
                <div className="scenario-banner">
                  <span>
                    Skenar demo:{' '}
                    {mode === 'loading'
                      ? 'ngarkim i ngadaltë'
                      : mode === 'error'
                        ? 'gabim në ngarkim'
                        : 'katalog bosh'}
                  </span>
                  <button onClick={() => setMode('normal')}>
                    Kthehu te katalogu <X size={14} />
                  </button>
                </div>
              )}
              <Catalog
                state={state}
                cart={cart}
                onQuantity={changeQuantity}
                onRetry={retryCatalog}
              />
            </div>
            <aside className="desktop-cart">
              {cartPanel}
              <div className="cart-bottom-note">
                <Leaf size={16} />
                <p>
                  Një porosi e menduar mirë,
                  <br />
                  <strong>një ditë më e lehtë për ju.</strong>
                </p>
              </div>
            </aside>
          </div>
          <footer className="workspace-footer">
            <span>© {new Date().getFullYear()} MarketOne</span>
            <span>E thjeshtë për ju. E mirë për biznesin.</span>
            <button onClick={() => setDialog('help')}>
              Si funksionon <ArrowRight size={13} />
            </button>
          </footer>
        </main>
      </div>
      <button className="mobile-cart-trigger" onClick={() => setDialog('cart')}>
        <span className="mobile-cart-icon">
          <ShoppingBag size={21} />
          <span>{count}</span>
        </span>
        <span>
          <strong>Porosia juaj</strong>
          <small>{count} njësi të përzgjedhura</small>
        </span>
        <b>{money(total)}</b>
        <ChevronRight size={19} />
      </button>
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>
              <Check size={16} />
            </span>
            {toast}
          </>
        )}
      </div>
      {dialog === 'cart' && (
        <Modal title="Porosia juaj" onClose={() => setDialog(null)} className="cart-modal">
          {cartPanel}
        </Modal>
      )}
      {dialog === 'review' && (
        <OrderReview
          items={items}
          onClose={() => setDialog(null)}
          onConfirm={(confirmed) => {
            setOrder(confirmed);
            dispatch({ type: 'clear' });
            setDialog('success');
          }}
        />
      )}
      {dialog === 'success' && order && (
        <OrderSuccess order={order} onClose={() => setDialog(null)} />
      )}
      {dialog === 'clear' && (
        <Modal title="Ta zbrazim porosinë?" onClose={() => setDialog(null)}>
          <p className="modal-intro">Të gjitha produktet do të hiqen nga porosia juaj aktuale.</p>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setDialog(null)}>
              Mbaje porosinë
            </button>
            <button
              className="button danger"
              onClick={() => {
                dispatch({ type: 'clear' });
                setDialog(null);
              }}
            >
              Po, zbraz porosinë
            </button>
          </div>
        </Modal>
      )}
      {dialog === 'logout' && (
        <Modal title="Dëshironi të dilni?" onClose={() => setDialog(null)}>
          <p className="modal-intro">Do të ktheheni te hyrja. Porosia aktuale do të pastrohet.</p>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setDialog(null)}>
              Qëndro këtu
            </button>
            <button className="button primary" onClick={onLogout}>
              Dil nga llogaria <LogOut size={16} />
            </button>
          </div>
        </Modal>
      )}
      {dialog === 'demo' && (
        <DemoDialog
          mode={mode}
          onMode={(nextMode) => {
            if (nextMode === mode) retry();
            else setMode(nextMode);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'help' && (
        <Modal title="Porosia juaj, në tre hapa" onClose={() => setDialog(null)}>
          <p className="modal-intro">Një rrugë e thjeshtë nga katalogu te porosia.</p>
          <ol className="help-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Zbuloni produktet</h3>
                <p>Kërkoni me emër ose zgjidhni një kategori. Filtroni vetëm produktet në stok.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Përgatitni porosinë</h3>
                <p>
                  Shtoni produktet dhe ndryshoni sasitë me + dhe −. Totali përditësohet menjëherë.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Rishikoni dhe konfirmoni</h3>
                <p>
                  Kontrolloni përmbledhjen dhe konfirmoni porosinë demo. Mund ta shkarkoni si
                  dokument tekst.
                </p>
              </div>
            </li>
          </ol>
          <button className="button primary full-width" onClick={() => setDialog(null)}>
            Le të fillojmë <ArrowRight size={17} />
          </button>
        </Modal>
      )}
    </div>
  );
}
