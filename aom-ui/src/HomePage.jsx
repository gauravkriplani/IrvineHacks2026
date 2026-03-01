import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MorphingParticles from './components/MorphingParticles';
import './HomePage.css';

/* ── Content ──────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '⬡',
    title: 'AOM Wrapper Generation',
    desc: 'Upload your React ZIP and receive fully-compliant Accessibility Object Model wrapper components auto-generated for every interactive element.',
  },
  {
    icon: '◎',
    title: 'Inline Source Annotation',
    desc: 'The AI scans your components and injects ARIA labels, roles, and descriptions directly — no manual markup required.',
  },
  {
    icon: '✦',
    title: 'LLM-Powered Intelligence',
    desc: 'Backed by large language models that understand your component hierarchy and produce standards-compliant output aligned with WAI-ARIA 1.2.',
  },
  {
    icon: '⬡',
    title: 'Instant ZIP Output',
    desc: 'Receive a ready-to-use ZIP in seconds containing all generated or annotated files, ready to drop into your codebase.',
  },
];

const DEVTYPES = [
  {
    label: 'Frontend developers',
    desc: 'Drop in AOM wrappers without touching a single aria-* attribute by hand.',
  },
  {
    label: 'Full-stack engineers',
    desc: 'Annotate entire React codebases in one pass — every component, every prop.',
  },
  {
    label: 'Accessibility auditors',
    desc: 'Get an AI-assisted head start on WCAG compliance before the manual audit begins.',
  },
];

const STATS = [
  { value: 'WAI-ARIA 1.2', label: 'Fully compliant output' },
  { value: '< 30s', label: 'Average generation time' },
  { value: '100%', label: 'Open source, no charge' },
];

/* ── Component ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [particleMode, setParticleMode] = useState('cursor');
  const ctaRef = useRef(null);

  return (
    <div className="hp-shell">
      <MorphingParticles
        mode={particleMode}
        targetRef={ctaRef}
        color1="#676A72"
        color2="#FF4641"
        color3="#346BF1"
      />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="hp-nav">
        <Link to="/" className="hp-nav-brand">
          <svg className="hp-nav-logo" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <polygon points="14,2 26,24 2,24" fill="#1a1a1a" />
            <polygon points="14,7 23,22 11,22" fill="#4285f4" opacity="0.75" />
          </svg>
          Agent Native
        </Link>
        <div className="hp-nav-center">
          <Link to="/toolkit" className="hp-nav-link">Product</Link>
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" className="hp-nav-link" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.w3.org/TR/wai-aria-1.2/" className="hp-nav-link" target="_blank" rel="noreferrer">WAI-ARIA</a>
        </div>
        <Link to="/toolkit" className="hp-nav-cta">Try the Toolkit</Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-inner">
          <div className="hp-hero-brand">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <polygon points="14,2 26,24 2,24" fill="#1a1a1a" />
              <polygon points="14,7 23,22 11,22" fill="#4285f4" opacity="0.85" />
            </svg>
            <span>Agent Native</span>
          </div>
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
            <a href="https://www.w3.org/TR/wai-aria-1.2/" target="_blank" rel="noreferrer" className="hp-btn-ghost">
              Explore WAI-ARIA
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="hp-features">
        <p className="hp-eyebrow">What it does</p>
        <h2 className="hp-section-title">
          Built for accessibility.<br />Built for agents.
        </h2>
        <div className="hp-features-grid">
          {FEATURES.map(f => (
            <div className="hp-feat-card" key={f.title}>
              <div className="hp-feat-icon">{f.icon}</div>
              <div className="hp-feat-title">{f.title}</div>
              <div className="hp-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dev types ────────────────────────────────────────────── */}
      <section className="hp-devs">
        <h2 className="hp-devs-title">
          Built for developers<br />
          <span className="hp-devs-era">for the agent-native era</span>
        </h2>
        <div className="hp-devs-grid">
          {DEVTYPES.map(d => (
            <div className="hp-dev-card" key={d.label}>
              <div className="hp-dev-label">{d.label}</div>
              <div className="hp-dev-desc">{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="hp-stats">
        {STATS.map(s => (
          <div className="hp-stat" key={s.label}>
            <div className="hp-stat-value">{s.value}</div>
            <div className="hp-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── CTA band ─────────────────────────────────────────────── */}
      <section className="hp-cta-band">
        <h2 className="hp-cta-title">Achieve new heights</h2>
        <p className="hp-cta-sub">
          Make your React app accessible to every agent and user — in minutes.
        </p>
        <Link to="/toolkit" className="hp-btn-white">Try the Toolkit</Link>
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
