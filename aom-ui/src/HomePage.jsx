import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MorphingParticles from './components/MorphingParticles';
import logoImg from './public/logo.webp';
import greenImg from './public/green.jpeg';
import grad1 from './public/HomeGradients2/aga-silva-pgoKgrsQr38-unsplash.jpg';
import grad2 from './public/HomeGradients2/beau-carpenter-eb5N9d5xLKA-unsplash.jpg';
import grad3 from './public/HomeGradients2/mohammed-kara-vI5Cx3LEZAc-unsplash.jpg';
import grad4 from './public/HomeGradients2/vurzie-kim-Sp2HQhVbdg0-unsplash.jpg';
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

const CAROUSEL_SLIDES = [grad1, grad2, grad3, grad4];

/* ── Component ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [particleMode, setParticleMode] = useState('cursor');
  const ctaRef = useRef(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prevSlide = () => setCarouselIdx(i => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  const nextSlide = () => setCarouselIdx(i => (i + 1) % CAROUSEL_SLIDES.length);

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
          <a href="https://www.w3.org/TR/wai-aria-1.2/" className="hp-nav-link" target="_blank" rel="noreferrer">Product</a>
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" className="hp-nav-link" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.w3.org/TR/wai-aria-1.2/" className="hp-nav-link" target="_blank" rel="noreferrer">WAI-ARIA</a>
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
              Today's agents scrape raw HTML — thousands of lines of CSS classes,
              nested divs, and noise. AOM gives them a single, semantic wrapper
              with everything they need to know.
            </p>
          </div>
          <div className="hp-compare-right">
            <div className="hp-compare-cards">
              <div className="hp-compare-card">
                <img src={beforeImg} alt="Before AOM" className="hp-compare-img" />
                <p className="hp-compare-caption">What AI agents see <strong>today</strong> — raw HTML they have to scrape, parse, and guess their way through.</p>
              </div>
              <div className="hp-compare-card hp-compare-card--after">
                <img src={afterImg} alt="After AOM" className="hp-compare-img" />
                <p className="hp-compare-caption">What AI agents see <strong>with AOM</strong> — a single wrapper that tells them exactly what it does. No scraping. No guessing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="hp-features">
        <h2 className="hp-section-title">
          Built for accessibility.<br /><span style={{color: '#0e0e0e'}}>Built for agents.</span>
        </h2>
        <p className="hp-features-sub">
          Choose the output that fits your workflow — auto-generated AOM wrappers, inline ARIA annotations, or a fully annotated ZIP ready to ship.
        </p>
        <div className="hp-features-grid">
          {FEATURES.map(f => (
            <div className="hp-feat-card" key={f.title}>
              <div className="hp-feat-preview" style={{'--feat-accent': f.accent}}>
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

      {/* ── Carousel ─────────────────────────────────────────────── */}
      <section className="hp-carousel-section">
        <div className="hp-carousel-wrapper">
          <button className="hp-carousel-arrow hp-carousel-arrow--prev" onClick={prevSlide} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="hp-carousel">
            <div
              className="hp-carousel-track"
              style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
            >
              {CAROUSEL_SLIDES.map((src, i) => (
                <div className="hp-carousel-slide" key={i}>
                  <img src={src} alt={`Slide ${i + 1}`} className="hp-carousel-img" />
                </div>
              ))}
            </div>

            <div className="hp-carousel-dots">
              {CAROUSEL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`hp-carousel-dot${i === carouselIdx ? ' hp-carousel-dot--active' : ''}`}
                  onClick={() => setCarouselIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button className="hp-carousel-arrow hp-carousel-arrow--next" onClick={nextSlide} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
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
