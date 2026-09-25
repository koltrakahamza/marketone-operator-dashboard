import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShoppingBag,
} from 'lucide-react';
import { Brand } from '../../components/Brand';

export const DEMO_EMAIL = 'operator@marketone.al';
export const DEMO_PASSWORD = 'MarketOne123!';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) onLogin();
    else {
      setError('Email-i ose fjalëkalimi nuk është i saktë. Përdor të dhënat demo më poshtë.');
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Mirë se vini në MarketOne">
        <Brand light />
        <div className="login-story-copy">
          <span className="eyebrow">
            <span className="little-line" /> MARKETI JUAJ, NJË HAP PËRPARA
          </span>
          <h1>
            Produkte të mira.
            <br />
            Porosi <em>të thjeshta.</em>
          </h1>
          <p>
            Gjithçka që i duhet marketit tuaj,
            <br />
            në një hapësirë të vetme.
          </p>
        </div>
        <div className="login-visual">
          <img
            src="/images/hero.jpg"
            alt="Përzgjedhje produktesh të freskëta për marketin"
            width="1000"
            height="750"
            fetchPriority="high"
          />
          <div className="floating-note">
            <span className="note-icon">
              <ShoppingBag size={20} />
            </span>
            <div>
              <strong>Furnizimi, i thjeshtuar.</strong>
              <span>Më pak hapa. Më shumë mundësi.</span>
            </div>
            <span className="note-check">
              <Check size={14} />
            </span>
          </div>
          <span className="fresh-stamp">
            <Leaf size={19} /> ZGJEDHJE TË MIRA, ÇDO DITË
          </span>
        </div>
        <div className="login-story-footer">
          <span>Hapësira e operatorit</span>
          <span>
            Me kujdes për çdo detaj <span aria-hidden="true">↗</span>
          </span>
        </div>
      </section>
      <section className="login-form-side">
        <div className="login-top">
          <Brand />
          <span className="demo-badge">Version demonstrues</span>
        </div>
        <div className="login-form-wrap">
          <div className="welcome-icon">
            <ShoppingBag size={24} strokeWidth={1.6} />
          </div>
          <span className="eyebrow">MIRË SE U KTHYET</span>
          <h2>
            Një ditë e mirë
            <br />
            fillon këtu.
          </h2>
          <p className="login-intro">
            Hyni në llogarinë tuaj dhe përgatitni
            <br className="desktop-break" /> porosinë e radhës për marketin.
          </p>
          <form onSubmit={submit} aria-label="Hyrja në llogari">
            <label htmlFor="email">Adresa e email-it</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="emri@marketi.al"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={busy}
                aria-describedby={error ? 'login-error' : undefined}
                aria-invalid={!!error}
              />
            </div>
            <label htmlFor="password">Fjalëkalimi</label>
            <div className="input-with-icon">
              <LockKeyhole size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Shkruani fjalëkalimin"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={busy}
                aria-describedby={error ? 'login-error' : undefined}
                aria-invalid={!!error}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="form-error" id="login-error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary login-submit" type="submit" disabled={busy}>
              {busy ? (
                <>
                  <LoaderCircle size={18} className="spin" /> Duke hyrë…
                </>
              ) : (
                <>
                  Hyr në MarketOne <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="demo-credentials">
            <div>
              <span className="demo-dot" />
              <strong>Eksploroni versionin demo</strong>
            </div>
            <p>Hyrja është e simuluar. Nuk nevojitet llogari reale.</p>
            <dl>
              <dt>Email</dt>
              <dd>{DEMO_EMAIL}</dd>
              <dt>Fjalëkalimi</dt>
              <dd>{DEMO_PASSWORD}</dd>
            </dl>
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_EMAIL);
                setPassword(DEMO_PASSWORD);
                setError('');
              }}
              disabled={busy}
            >
              Plotëso të dhënat demo <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <footer className="login-footer">
          MarketOne <span>·</span> Një mënyrë më e mirë për të porositur.
        </footer>
      </section>
    </main>
  );
}
