import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ICONS, ProductGrid } from '../components/Catalog';
import { useCatalog } from '../catalog';
import { COLLECTIONS, PILLARS, WHATSAPP } from '../data';
import { useLayout } from '../layout';
import { PATHS, productPath, shopPath } from '../routes';
import { useTilt } from '../tilt';

const wrap = (px: string): React.CSSProperties => ({ maxWidth: 1280, margin: '0 auto', paddingLeft: px, paddingRight: px });

/** Icônes des engagements (maquette) : livraison, échange, paiement, service client. */
const PILLAR_ICONS = [
  <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  <><path d="M4 12a8 8 0 0114-5l2 2M20 12a8 8 0 01-14 5l-2-2" /><path d="M20 4v5h-5M4 20v-5h5" /></>,
  <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  <path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
];

/** Lien de contact : WhatsApp si un numéro est configuré, sinon la page contact. */
export const quoteLink = (text: string) =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : PATHS.contact;

function Hero() {
  const L = useLayout();
  const { products } = useCatalog();
  // Article mis en avant : le premier commandable avec une photo.
  const hero = products.find((p) => p.purchasable && p.image) ?? products.find((p) => p.image);
  const tilt = useTilt<HTMLAnchorElement>(6);
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
      <div style={{ ...wrap(L.mobile ? '20px' : '24px'), paddingTop: L.mobile ? 48 : 72, paddingBottom: L.mobile ? 48 : 72, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
        <div data-reveal style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p className="eyebrow">Nouvelle collection · Saison 2026</p>
          <h1 className="display" style={{ fontSize: 'clamp(56px, 8vw, 112px)', lineHeight: 0.92, textTransform: 'uppercase' }}>
            Le terrain<br />commence <span style={{ color: 'var(--accent)' }}>ici.</span>
          </h1>
          <p style={{ margin: 0, maxWidth: 480, fontSize: 18, lineHeight: 1.6, color: 'var(--muted)' }}>
            Maillots, shorts, sweats et baskets pensés pour jouer fort et rester stylé en dehors du parquet.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link className="btn btn-primary" to={shopPath('all')} style={{ height: 56 }}>Voir la collection</Link>
            <a className="btn btn-ghost-light" href="#perso" style={{ height: 56 }}>Personnaliser un maillot</a>
          </div>
        </div>
        <Link
          ref={tilt} data-reveal to={hero ? productPath(hero.id) : shopPath('all')} aria-label={hero ? `Voir ${hero.name}` : 'Voir la collection'} className="tilt"
          style={{ flex: '1 1 420px', minWidth: 0, position: 'relative', height: L.mobile ? 380 : 520, borderRadius: 24, background: '#161616', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          {/* Lignes du terrain : rond central et axes, à l'orange de la marque. */}
          <div aria-hidden style={{ position: 'absolute', width: 420, maxWidth: '86%', aspectRatio: '1', borderRadius: '50%', border: '3px solid var(--accent)', opacity: 0.6 }} />
          <div aria-hidden style={{ position: 'absolute', width: 3, height: '100%', background: 'var(--accent)', opacity: 0.35 }} />
          <div aria-hidden style={{ position: 'absolute', height: 3, width: '100%', background: 'var(--accent)', opacity: 0.35 }} />
          {hero?.image
            ? <img src={hero.image} alt={hero.name} style={{ position: 'relative', width: '78%', height: '86%', objectFit: 'contain', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.6))' }} />
            : <svg aria-hidden width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="1.2" strokeLinejoin="round" style={{ position: 'relative' }}><path d={ICONS.maillots} /></svg>}
          <span className="tilt-glare" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const L = useLayout();
  const { products, hidden } = useCatalog();
  const px = L.mobile ? '20px' : '24px';
  // Nouveautés : les articles publiés le plus récemment.
  const fresh = useMemo(
    () => [...products].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')).slice(0, 8),
    [products],
  );
  const cats = COLLECTIONS.filter((c) => !hidden(c.id));

  return (
    <>
      <Hero />

      <section aria-label="Catégories" style={{ ...wrap(px), paddingTop: 72, paddingBottom: 24 }}>
        <h2 className="display" style={{ margin: '0 0 28px', fontSize: L.mobile ? 38 : 48, textTransform: 'uppercase' }}>Acheter par catégorie</h2>
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${L.mobile ? 150 : 200}px, 1fr))`, gap: 16 }}>
          {cats.map((c, i) => (
            <Link
              key={c.id} to={shopPath(c.id)}
              style={{ background: '#161616', border: '1px solid var(--line)', borderRadius: 16, padding: 24, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color .3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <span style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display-font)', fontSize: 22, fontWeight: 800 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'var(--display-font)', fontSize: 30, fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink)' }}>{c.label}</span>
                <span style={{ fontSize: 14, color: 'var(--graphite)' }}>{c.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="nouveautes" style={{ ...wrap(px), paddingTop: 72, paddingBottom: 72 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="eyebrow">Tout juste arrivés</p>
            <h2 className="display" style={{ fontSize: L.mobile ? 38 : 48, textTransform: 'uppercase' }}>Nouveautés</h2>
          </div>
          <Link to={shopPath('all')} style={{ fontWeight: 700, fontSize: 15, padding: '12px 0', color: 'var(--accent)' }}>Tout voir →</Link>
        </div>
        <ProductGrid items={fresh} />
      </section>

      <section id="perso" style={{ ...wrap(px), paddingBottom: 72 }}>
        <div data-reveal style={{ background: 'var(--accent)', color: '#0A0A0A', borderRadius: 24, padding: L.mobile ? '40px 24px' : '56px 48px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '.24em' }}>ÉQUIPES · CLUBS · ÉCOLES</p>
            <h2 className="display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', textTransform: 'uppercase' }}>Ton nom. Ton numéro.<br />Ton équipe.</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, maxWidth: 520 }}>Maillots et shorts personnalisés pour toute l’équipe : nom, numéro et logo du club.</p>
          </div>
          <a className="btn btn-dark" href={quoteLink('Bonjour Incomart, je voudrais un devis pour des maillots personnalisés.')} target={WHATSAPP ? '_blank' : undefined} rel="noreferrer" style={{ height: 58, padding: '0 32px', fontSize: 16 }}>
            Demander un devis
          </a>
        </div>
      </section>

      <section aria-label="Nos engagements" style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{ ...wrap(px), paddingTop: 48, paddingBottom: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {PILLARS.map((p, i) => (
            <div key={p.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <svg aria-hidden width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>{PILLAR_ICONS[i]}</svg>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{p.t}</h3>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--graphite)' }}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
