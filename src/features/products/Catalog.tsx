import { useState } from 'react';
import {
  ArrowDownUp,
  ArrowRight,
  CircleAlert,
  LayoutGrid,
  List,
  PackageOpen,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { Cart, LoadState, Product } from '../../types';
import { normalize } from '../../lib/format';
import { ProductCard } from './ProductCard';

export function Catalog({
  state,
  cart,
  onQuantity,
  onRetry,
}: {
  state: LoadState;
  cart: Cart;
  onQuantity: (product: Product, quantity: number) => void;
  onRetry: () => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Të gjitha');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const products = state.status === 'success' ? state.products : [];
  const categories = ['Të gjitha', ...new Set(products.map((product) => product.category))];
  const filtered = products
    .filter(
      (product) =>
        (category === 'Të gjitha' || product.category === category) &&
        (!inStock || product.stock > 0) &&
        normalize(`${product.name} ${product.category} ${product.supplier}`).includes(
          normalize(query),
        ),
    )
    .sort((a, b) =>
      sort === 'price-asc'
        ? a.priceCents - b.priceCents
        : sort === 'price-desc'
          ? b.priceCents - a.priceCents
          : sort === 'name'
            ? a.name.localeCompare(b.name, 'sq')
            : Number(!!b.featured) - Number(!!a.featured),
    );
  const filteredOn = query.trim() !== '' || category !== 'Të gjitha' || inStock;
  function reset() {
    setQuery('');
    setCategory('Të gjitha');
    setInStock(false);
  }

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog-title-row">
        <div>
          <span className="eyebrow">ZGJIDHNI PËR MARKETIN TUAJ</span>
          <h2 id="catalog-title">
            Katalogu i produkteve <span>{state.status === 'success' ? products.length : '—'}</span>
          </h2>
        </div>
        <span className="catalog-origin">
          <span /> Katalog demo
        </span>
      </div>
      <div className="catalog-search-row">
        <div className="search-input">
          <Search size={19} />
          <input
            type="search"
            placeholder="Kërko një produkt, kategori, furnitor…"
            aria-label="Kërko produkte"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="icon-button"
              aria-label="Pastro kërkimin"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <label className={`stock-filter ${inStock ? 'active' : ''}`}>
          <input
            type="checkbox"
            aria-label="Vetëm në stok"
            checked={inStock}
            onChange={(event) => setInStock(event.target.checked)}
          />
          <SlidersHorizontal size={16} />
          <span>Vetëm në stok</span>
        </label>
      </div>
      <div className="category-tabs" role="group" aria-label="Filtro sipas kategorisë">
        {categories.map((item) => (
          <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="catalog-toolbar">
        <p aria-live="polite">
          {state.status === 'loading' ? (
            'Duke përgatitur katalogun…'
          ) : state.status === 'error' ? (
            'Katalogu nuk u ngarkua'
          ) : (
            <>
              <strong>{filtered.length}</strong> produkte{' '}
              {filteredOn ? 'të gjetura' : 'për t’u zbuluar'}
            </>
          )}
          {filteredOn && (
            <button className="reset-filters" onClick={reset}>
              Pastro filtrat <X size={12} />
            </button>
          )}
        </p>
        <div className="catalog-view-tools">
          <label className="sort-control">
            <ArrowDownUp size={14} />
            <select
              aria-label="Rendit produktet"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Të përzgjedhura</option>
              <option value="price-asc">Çmimi: në rritje</option>
              <option value="price-desc">Çmimi: në zbritje</option>
              <option value="name">Emri: A–Z</option>
            </select>
          </label>
          <div className="view-toggle" aria-label="Paraqitja e katalogut">
            <button
              aria-label="Paraqitje me karta"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              aria-label="Paraqitje me listë"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>
      {state.status === 'loading' ? (
        <div
          className={`product-grid ${view === 'list' ? 'list-view' : ''}`}
          aria-busy="true"
          aria-label="Produktet po ngarkohen"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div className="product-skeleton" key={index}>
              <div className="skeleton skeleton-photo" />
              <div className="skeleton-lines">
                <div className="skeleton" />
                <div className="skeleton" />
                <div className="skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : state.status === 'error' ? (
        <div className="catalog-state" role="alert">
          <span className="state-icon error">
            <CircleAlert size={29} />
          </span>
          <h3>Le ta provojmë edhe një herë.</h3>
          <p>{state.message}</p>
          <button className="button primary" onClick={onRetry}>
            <RotateCcw size={16} /> Provo përsëri
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="catalog-state">
          <span className="state-icon">
            <PackageOpen size={32} />
          </span>
          <h3>Katalogu është ende bosh.</h3>
          <p>Produktet e reja do të shfaqen këtu sapo të jenë të disponueshme.</p>
          <button className="button secondary" onClick={onRetry}>
            Rifresko katalogun <RotateCcw size={15} />
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="catalog-state">
          <span className="state-icon">
            <SearchX size={31} />
          </span>
          <h3>Nuk gjetëm produkte.</h3>
          <p>Provo një emër tjetër ose hiq filtrat e përzgjedhur.</p>
          <button className="button secondary" onClick={reset}>
            Shfaq të gjitha produktet <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className={`product-grid ${view === 'list' ? 'list-view' : ''}`}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] ?? 0}
              onQuantity={onQuantity}
            />
          ))}
        </div>
      )}
      <div className="catalog-footer">
        <span>Çmimet janë për njësinë e shënuar, në EUR.</span>
        <span>
          MarketOne <span aria-hidden="true">✳</span>
        </span>
      </div>
    </section>
  );
}
