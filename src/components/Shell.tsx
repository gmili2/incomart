import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCatalog } from '../catalog';
import { fmt } from '../data';
import { useLayout } from '../layout';
import { PATHS, productPath, shopPath } from '../routes';
import { useStore } from '../store';
import { ArrowIcon, BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './icons';

const NAV: { label: string; to: string; match: (path: string) => boolean; hot?: boolean }[] = [
  { label: 'Maillots', to: shopPath('maillots'), match: (p) => p === shopPath('maillots') },
  { label: 'Shorts', to: shopPath('shorts'), match: (p) => p === shopPath('shorts') },
  { label: 'Sweats', to: shopPath('sweats'), match: (p) => p === shopPath('sweats') },
  { label: 'Baskets', to: shopPath('baskets'), match: (p) => p === shopPath('baskets') },
  { label: 'Accessoires', to: shopPath('accessoires'), match: (p) => p === shopPath('accessoires') },
  { label: 'Promos', to: shopPath('promo'), match: (p) => p === shopPath('promo'), hot: true },
];

export function Logo({ size }: { size: number; light?: boolean }) {
  return (
    <img src="/logo.png" alt="INCOMART" width={size} height={size} style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%' }} />
  );
}

/** Logo rond + nom « INCOMART HOOPS » de la maquette. */
function Brand({ size, hoops = true }: { size: number; hoops?: boolean }) {
  return (
    <Link to="/" aria-label="INCOMART — accueil" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink)' }}>
      <Logo size={size} />
      <span style={{ fontFamily: 'var(--display-font)', fontSize: size > 60 ? 28 : 24, fontWeight: 800, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>
        INCO<span style={{ color: 'var(--accent)' }}>MART</span>
        {hoops && <span style={{ fontSize: 16, color: 'var(--graphite)', fontWeight: 600, letterSpacing: '.2em', marginLeft: 8 }}>HOOPS</span>}
      </span>
    </Link>
  );
}

export function TopBar() {
  return (
    <div style={{ background: 'var(--accent)', color: '#0A0A0A', textAlign: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '.04em', padding: '10px 16px' }}>
      Livraison partout au Maroc · Paiement à la livraison
    </div>
  );
}

function CartButton() {
  const { count, openDrawer } = useStore();
  return (
    <button className="icon-btn" onClick={openDrawer} aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
      <BagIcon size={22} />
      {count > 0 && <span className="badge-count">{count}</span>}
    </button>
  );
}

export function Header() {
  const L = useLayout();
  const { pathname } = useLocation();
  const { openSearch, openMenu } = useStore();
  const wrap: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 40,
    background: 'rgba(10,10,10,.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid var(--line)',
  };
  if (L.mobile) {
    return (
      <header style={wrap}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, padding: '0 8px' }}>
          <button className="icon-btn" onClick={openMenu} aria-label="Menu"><MenuIcon size={22} /></button>
          <Brand size={44} hoops={false} />
          <div style={{ display: 'flex' }}>
            <button className="icon-btn" onClick={openSearch} aria-label="Rechercher"><SearchIcon size={22} /></button>
            <CartButton />
          </div>
        </div>
      </header>
    );
  }
  return (
    <header style={wrap}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Brand size={64} />
        <nav aria-label="Catégories" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className={`nav-link${n.match(pathname) ? ' on' : ''}`} style={n.hot ? { color: 'var(--accent)', fontWeight: 700 } : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn" onClick={openSearch} aria-label="Rechercher"><SearchIcon size={22} /></button>
          <Link className="icon-btn" to={PATHS.account} aria-label="Mon compte"><UserIcon size={22} /></Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}

const FOOTER = [
  { t: 'Boutique', links: [['Maillots', shopPath('maillots')], ['Shorts', shopPath('shorts')], ['Baskets', shopPath('baskets')], ['Accessoires', shopPath('accessoires')]] },
  { t: 'Aide', links: [['Livraison & retours', PATHS.faq], ['Guide des tailles', PATHS.faq], ['Contact', PATHS.contact], ['Mon compte', PATHS.account]] },
  { t: 'Infos', links: [['À propos', PATHS.about], ['Conditions générales', PATHS.cgv], ['Confidentialité', PATHS.privacy]] },
];

export function Footer() {
  const L = useLayout();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: L.mobile ? '56px 20px' : '72px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24, borderTop: '1px solid var(--line)' }}>
        <div style={{ flex: '1 1 380px', minWidth: 0 }}>
          <h2 className="display" style={{ margin: '0 0 8px', fontSize: 40, textTransform: 'uppercase' }}>Rejoins le crew</h2>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--graphite)' }}>
            {subscribed ? 'Bienvenue dans le crew ! Tu recevras nos prochains drops en avant-première.' : 'Drops en avant-première et offres réservées aux abonnés.'}
          </p>
        </div>
        {!subscribed && (
          <form onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) setSubscribed(true); }} style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton@email.com" aria-label="Adresse e-mail"
              style={{ flex: '1 1 240px', minWidth: 0, height: 52, padding: '0 20px', borderRadius: 999, border: '1px solid var(--line-strong)', background: '#161616', color: 'var(--ink)', fontSize: 16, outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ height: 52, padding: '0 28px' }}>S’inscrire</button>
          </form>
        )}
      </section>
      <footer style={{ borderTop: '1px solid var(--line)', background: '#050505' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Logo size={120} />
            <p style={{ margin: 0, fontSize: 14, color: 'var(--graphite)' }}>Style · Qualité · Confort</p>
          </div>
          {FOOTER.map((g) => (
            <div key={g.t} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 14, letterSpacing: '.16em', color: 'var(--graphite)', textTransform: 'uppercase' }}>{g.t}</h3>
              {g.links.map(([label, to]) => <Link key={label} to={to} style={{ fontSize: 15 }}>{label}</Link>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24, borderTop: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#8A8A8A' }}>
          <span>© 2026 Incomart. Tous droits réservés.</span>
          <span style={{ display: 'flex', gap: 20 }}><span>Paiement à la livraison · Virement bancaire</span><Link to={PATHS.admin} style={{ color: '#8A8A8A' }}>Administration</Link></span>
        </div>
      </footer>
    </>
  );
}

function QtyStepper({ qty, onDec, onInc, h = 36 }: { qty: number; onDec: () => void; onInc: () => void; h?: number }) {
  const b: React.CSSProperties = { width: h - 2, height: h - 2, border: 0, background: 'none', cursor: 'pointer', fontSize: 16 };
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: h, border: '1px solid var(--line-strong)', borderRadius: 999, background: 'var(--paper)' }}>
      <button style={b} onClick={onDec} aria-label="Diminuer la quantité">−</button>
      <span style={{ minWidth: 16, textAlign: 'center', fontSize: 13.5 }}>{qty}</span>
      <button style={b} onClick={onInc} aria-label="Augmenter la quantité">+</button>
    </div>
  );
}
export { QtyStepper };

export function Overlays() {
  const L = useLayout();
  const navigate = useNavigate();
  const s = useStore();
  const anyOverlay = s.drawer || s.search;

  // Recherche
  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (s.search) setTimeout(() => searchRef.current?.focus(), 250); }, [s.search]);
  const { products } = useCatalog();
  const query = q.trim().toLowerCase();
  const results = useMemo(
    () => (query
      ? products.filter((p) => `${p.name} ${p.col} ${p.kind} ${p.sku} ${p.swatches.map((x) => x.label).join(' ')}`.toLowerCase().includes(query))
      : products.slice(0, 4)),
    [query, products],
  );

  const go = (to: string) => { s.closeAll(); navigate(to); };

  return (
    <>
      <div
        onClick={s.closeAll}
        style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.6)', opacity: anyOverlay ? 1 : 0, pointerEvents: anyOverlay ? 'auto' : 'none', transition: 'opacity .5s ease' }}
      />

      {/* Panier latéral */}
      <aside
        aria-label="Panier" aria-hidden={!s.drawer}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 70, width: 'min(440px,100vw)', background: 'var(--ivory)', display: 'flex', flexDirection: 'column', transform: s.drawer ? 'translateX(0)' : 'translateX(105%)', transition: 'transform .6s var(--ease)', boxShadow: '-20px 0 60px rgba(0,0,0,.5)', borderLeft: '1px solid var(--line)', visibility: s.drawer ? 'visible' : 'hidden', transitionProperty: 'transform, visibility' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
          <span className="display" style={{ textTransform: 'uppercase', fontSize: 26 }}>Panier · {s.count}</span>
          <button className="icon-btn" onClick={s.closeAll} aria-label="Fermer"><CloseIcon /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {s.count === 0 && <p style={{ margin: '32px 0', fontSize: 15, color: 'var(--muted)' }}>Votre panier est vide.</p>}
          {s.items.map((l) => {
            const p = l.product;
            return (
              <div key={l.key} style={{ display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
                <button className="ph" onClick={() => go(productPath(p.id))} aria-label={p.name} style={{ aspectRatio: '1', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {l.image
                    ? <img src={l.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ width: '52%', aspectRatio: '1', borderRadius: '50%', border: '1px solid rgba(245,245,245,.17)' }} />}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, textTransform: 'uppercase' }}>{p.name}</span>
                      {l.label && <span style={{ fontSize: 12.5, color: 'var(--graphite)' }}>{l.label}</span>}
                    </span>
                    <span style={{ fontSize: 14, whiteSpace: 'nowrap' }}>{fmt(l.unit * l.qty)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <QtyStepper qty={l.qty} onDec={() => s.setQty(l.key, -1)} onInc={() => s.setQty(l.key, 1)} />
                    <button onClick={() => s.remove(l.key)} style={{ background: 'none', border: 0, borderBottom: '1px solid var(--faint)', padding: '1px 0', cursor: 'pointer', fontSize: 12, color: 'var(--muted)' }}>Retirer</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '20px 24px 24px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--paper)' }}>
          {s.qtyDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>{s.qtyLabel}</span><span>−{fmt(s.qtyDiscount)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 14 }}>{s.qtyDiscount > 0 ? 'Total' : 'Sous-total'} · livraison incluse</span>
            <span style={{ fontStretch: '110%', fontSize: 20, fontWeight: 500 }}>{fmt(s.subtotal - s.qtyDiscount)}</span>
          </div>
          {s.nextTier && <span style={{ fontSize: 13, padding: '10px 12px', background: '#1F1F1F', lineHeight: 1.4 }}>Ajoutez {s.nextTier.missing} {s.nextTier.productName ?? `article${s.nextTier.missing > 1 ? 's' : ''}`} et économisez <strong>{fmt(s.nextTier.amount)}</strong> sur votre commande.</span>}
          <button className="btn btn-primary" disabled={s.count === 0} onClick={() => go(PATHS.checkout)} style={{ opacity: s.count === 0 ? 0.4 : 1 }}>Commander</button>
          <button className="btn btn-outline" style={{ height: 50 }} onClick={() => go(PATHS.cart)}>Voir le panier</button>
        </div>
      </aside>

      {/* Menu mobile */}
      <div
        aria-hidden={!s.menu}
        style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#0A0A0A', color: '#F5F5F5', display: 'flex', flexDirection: 'column', padding: '12px 20px 32px', opacity: s.menu ? 1 : 0, pointerEvents: s.menu ? 'auto' : 'none', transition: 'opacity .45s ease', visibility: s.menu ? 'visible' : 'hidden' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 52 }}>
          <Logo size={44} />
          <button className="icon-btn" onClick={s.closeAll} aria-label="Fermer" style={{ background: 'transparent' }}><CloseIcon color="#fff" size={20} /></button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', marginTop: 36 }}>
          {NAV.map((n) => (
            <button key={n.label} onClick={() => go(n.to)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 0, borderBottom: '1px solid #2A2A2A', color: '#F5F5F5', cursor: 'pointer', fontFamily: 'var(--display-font)', fontWeight: 800, textTransform: 'uppercase', fontSize: 30, textAlign: 'left' }}>
              {n.label}<ArrowIcon color="#fff" />
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost-light" style={{ flex: 1, height: 52, padding: 0 }} onClick={() => go(PATHS.account)}>Mon compte</button>
          <button className="btn btn-light" style={{ flex: 1, height: 52, padding: 0 }} onClick={() => go(PATHS.cart)}>Panier ({s.count})</button>
        </div>
      </div>

      {/* Recherche */}
      <div
        role="search" aria-hidden={!s.search}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 75, background: 'var(--ivory)', borderBottom: '1px solid var(--line)', padding: `20px ${L.px} 28px`, transform: s.search ? 'translateY(0)' : 'translateY(-105%)', transition: 'transform .55s var(--ease)', visibility: s.search ? 'visible' : 'hidden', transitionProperty: 'transform, visibility' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--ink)', paddingBottom: 10 }}>
          <SearchIcon size={22} />
          <input
            ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(productPath(results[0].id)); }}
            placeholder="Rechercher un maillot, un short, une basket…" aria-label="Rechercher"
            style={{ flex: 1, minWidth: 0, height: 48, border: 0, background: 'transparent', fontSize: L.searchFs, fontStretch: '110%', outline: 'none', color: 'var(--ink)' }}
          />
          <button className="icon-btn" onClick={s.closeAll} aria-label="Fermer"><CloseIcon /></button>
        </div>
        <span className="mono" style={{ display: 'block', marginTop: 18, fontSize: 10.5, letterSpacing: '.14em' }}>
          {query ? `${results.length} résultat${results.length > 1 ? 's' : ''}` : 'Les plus recherchés'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
          {results.map((p) => (
            <button
              key={p.id} onClick={() => go(productPath(p.id))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '14px 0', background: 'none', border: 0, borderBottom: '1px solid var(--line)', cursor: 'pointer', textAlign: 'left', transition: 'padding .3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.paddingLeft = '8px')}
              onMouseLeave={(e) => (e.currentTarget.style.paddingLeft = '0')}
            >
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 15, fontWeight: 600, textTransform: 'uppercase' }}>{p.name}</span>
                <span style={{ fontSize: 12.5, color: 'var(--graphite)' }}>{p.kind}</span>
              </span>
              <span style={{ fontSize: 14 }}>{p.hasRange ? 'dès ' : ''}{fmt(p.price)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
