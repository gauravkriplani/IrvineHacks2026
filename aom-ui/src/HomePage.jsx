import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MorphingParticles from './components/MorphingParticles';
import TiltCard from './components/TiltCard';
import logoImg from './public/logo.webp';
import greenImg from './public/green.jpeg';
import annotationImg from './public/aleksandr-zaitsev-cRS3WCABL18-unsplash.jpg';
import llmImg from './public/eugene-golovesov-wkb5BM3vlWY-unsplash.jpg';
import zipImg from './public/amy-w-YbVCgsg84lA-unsplash.jpg';
import beforeImg from './public/1.png';
import afterImg from './public/2.png';
import './HomePage.css';

/* ── Content ──────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '⬡',
    accent: '#4285F4',
    image: greenImg,
    title: 'AOM Wrapper Generation',
    desc: 'Upload your React ZIP and receive fully-compliant Accessibility Object Model wrapper components auto-generated for every interactive element.',
  },
  {
    icon: '◎',
    accent: '#8430CE',
    image: annotationImg,
    title: 'Inline Source Annotation',
    desc: 'The AI scans your components and injects ARIA labels, roles, and descriptions directly — no manual markup required.',
  },
  {
    icon: '✦',
    accent: '#E84683',
    image: llmImg,
    title: 'LLM-Powered Intelligence',
    desc: 'Backed by large language models that understand your component hierarchy and produce standards-compliant output aligned with WAI-ARIA 1.2.',
  },
  {
    icon: '◈',
    accent: '#34A853',
    image: zipImg,
    title: 'Instant ZIP Output',
    desc: 'Receive a ready-to-use ZIP in seconds containing all generated or annotated files, ready to drop into your codebase.',
  },
];


/* ── Component ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [particleMode, setParticleMode] = useState('cursor');
  const ctaRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="hp-shell">
      <MorphingParticles
        mode={particleMode}
        targetRef={ctaRef}
        color1="#2D6A4F"
        color2="#52B788"
        color3="#95D5B2"
      />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className={`hp-nav${scrolled ? ' hp-nav--island' : ''}`}>
        <Link to="/" className="hp-nav-brand">
          <img src={logoImg} alt="Agent Native logo" className="hp-nav-logo" />
          Agent Native
        </Link>
        <div className="hp-nav-center">
          <Link to="/toolkit" className="hp-nav-link">Product</Link>
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" className="hp-nav-link" target="_blank" rel="noreferrer">GitHub</a>
          <Link to="/team" className="hp-nav-link">About Us</Link>
        </div>
        {/* <Link to="/toolkit" className="hp-nav-cta">Try the Toolkit</Link> */}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-inner">
          <h1 className="hp-hero-title">
            Experience accessibility<br />for the agent-first web
          </h1>
          <p className="hp-hero-sub">
            Auto-generate WAI-ARIA-compliant AOM wrappers for every component in your React codebase — in seconds, powered by AI.
          </p>
          <div className="hp-hero-btns">
            <Link
              to="/toolkit"
              className="hp-btn-primary"
              ref={ctaRef}
              onMouseEnter={() => setParticleMode('border')}
              onMouseLeave={() => setParticleMode('cursor')}
            >
              Try the Toolkit
            </Link>
            {/* <a href="https://www.w3.org/TR/wai-aria-1.2/" target="_blank" rel="noreferrer" className="hp-btn-ghost">
              Explore WAI-ARIA
            </a> */}
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────────────── */}
      <section className="hp-compare">
        <div className="hp-compare-inner">
          <div className="hp-compare-left">
            <p className="hp-eyebrow">Why AOM</p>
            <h2 className="hp-compare-heading">
              2 extra lines of code.<br />
              10x less work for every<br />
              AI agent that touches your site.
            </h2>
            <p className="hp-compare-body">
              Drop your source on the left — collect your AOM wrappers on the right.
            </p>
          </div>
          <div className="hp-compare-right">
            <div className="hp-compare-cards">
              <TiltCard className="hp-compare-card" maxTilt={6}>
                <img src={beforeImg} alt="Before AOM" className="hp-compare-img" />
                <p className="hp-compare-caption">What AI agents see <strong>today</strong> — raw HTML they have to scrape, parse, and guess their way through.</p>
              </TiltCard>
              <TiltCard className="hp-compare-card hp-compare-card--after" maxTilt={6}>
                <img src={afterImg} alt="After AOM" className="hp-compare-img" />
                <p className="hp-compare-caption">What AI agents see <strong>with AOM</strong> — a single wrapper that tells them exactly what it does. No scraping. No guessing.</p>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="hp-features">
        <h2 className="hp-section-title">
          Built for accessibility.<br /><span style={{ color: '#0e0e0e' }}>Built for agents.</span>
        </h2>
        <p className="hp-features-sub">
          Choose the output that fits your workflow — auto-generated AOM wrappers, inline ARIA annotations, or a fully annotated ZIP ready to ship.
        </p>
        <div className="hp-features-grid">
          {FEATURES.map((f, i) => (
            <div className="hp-feat-card" key={f.title}>
              <div className="hp-feat-preview" style={{ '--feat-accent': f.accent }}>
                <div className="hp-feat-number">{i + 1}</div>
                {f.image
                  ? <img src={f.image} alt={f.title} className="hp-feat-preview-img" />
                  : <span className="hp-feat-preview-icon">{f.icon}</span>
                }
              </div>
              <div className="hp-feat-content">
                <div className="hp-feat-title">{f.title}</div>
                <div className="hp-feat-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────── */}
      <section className="hp-cta-section">
        <div className="hp-cta-band">
          <h2 className="hp-cta-title">Achieve new heights</h2>
          <p className="hp-cta-sub">
            Make your React app accessible to every agent and user — in minutes.
          </p>
          <Link to="/toolkit" className="hp-btn-white">Try the Toolkit</Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="hp-footer">
        <span className="hp-footer-brand">Agent Native</span>
        <span className="hp-footer-copy">&copy; 2026 IrvineHacks2026 Team</span>
        <div className="hp-footer-links">
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>

    </div>
  );
}
