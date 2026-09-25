import {
  ArrowUpRight,
  Boxes,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Leaf,
  LogOut,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { Brand } from './Brand';

export function Sidebar({
  count,
  onCart,
  onHelp,
  onDemo,
  onLogout,
}: {
  count: number;
  onCart: () => void;
  onHelp: () => void;
  onDemo: () => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="#main" aria-label="MarketOne · Produktet">
        <Brand />
      </a>
      <div className="workspace-chip">
        <span>
          <Store size={18} />
        </span>
        <div>
          <strong>Market Tilia</strong>
          <small>Hapësira e operatorit</small>
        </div>
        <span className="workspace-dot" />
      </div>
      <span className="nav-label">HAPËSIRA JUAJ</span>
      <nav aria-label="Navigimi kryesor">
        <a
          href="#catalog-title"
          className="nav-item active"
          aria-current="page"
          aria-label="Produktet"
        >
          <Boxes size={19} />
          <span>Produktet</span>
          <ChevronRight size={14} />
        </a>
        <button className="nav-item" onClick={onCart} aria-label="Porosia ime">
          <ShoppingBag size={19} />
          <span>Porosia ime</span>
          {count > 0 && <span className="nav-count">{count}</span>}
        </button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="sidebar-leaf">
            <Leaf size={22} strokeWidth={1.5} />
          </span>
          <h3>
            Çdo ditë,
            <br />
            një zgjedhje e mirë.
          </h3>
          <p>
            Produkte për marketin.
            <br />
            Më shumë kohë për ju.
          </p>
          <button onClick={onHelp}>
            Si funksionon <ArrowUpRight size={15} />
          </button>
        </div>
        <button className="nav-item" onClick={onHelp} aria-label="Udhëzues i shpejtë">
          <CircleHelp size={18} />
          <span>Udhëzues i shpejtë</span>
        </button>
        <button className="nav-item" onClick={onDemo} aria-label="Versioni demo">
          <FlaskConical size={18} />
          <span>Versioni demo</span>
        </button>
        <div className="sidebar-user">
          <span className="avatar">AT</span>
          <div>
            <strong>Arta Tilia</strong>
            <small>Operator · Market Tilia</small>
          </div>
          <button className="icon-button" onClick={onLogout} aria-label="Dil nga llogaria">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
