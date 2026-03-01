import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  { value: '< 30s',        label: 'Average generation time' },
  { value: '100%',         label: 'Open source, no charge' },
];

/* ── Particle colours (matches antigravity.google light palette) ─────────── */
const C1 = { r: 66,  g: 133, b: 244 }; // Gemini blue   #4285F4
const C2 = { r: 132, g: 48,  b: 206 }; // Gemini purple #8430CE
const C3 = { r: 232, g: 70,  b: 131 }; // Gemini pink   #E84683

function lerpC(a, b, t) {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}
function triColour(t) {
  return t < 0.5 ? lerpC(C1, C2, t / 0.5) : lerpC(C2, C3, (t - 0.5) / 0.5);
}

function makeParticle() {
  return {
    x: 0, y: 0,
    angle:      Math.random() * Math.PI * 2,
    orbitR:     80 + Math.random() * 400,
    orbitSpeed: (0.000035 + Math.random() * 0.000065) * (Math.random() < 0.5 ? 1 : -1),
    breathAmp:  6 + Math.random() * 14,
    breathFreq: 0.0006 + Math.random() * 0.001,
    breathPh:   Math.random() * Math.PI * 2,
    vx: 0, vy: 0,
    lag:  0.004 + Math.random() * 0.005,
    drag: 0.96,
    len:       5 + Math.random() * 9,
    thickness: 1.2 + Math.random() * 1.3,
    col:       triColour(Math.random()),
    alpha:     0.10 + Math.random() * 0.13,
  };
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = canvas.parentElement;
    const ctx    = canvas.getContext('2d');

    let W = 0, H = 0;

    const cx = { val: 0, v: 0, target: 0 };
    const cy = { val: 0, v: 0, target: 0 };
    const CENTER_K    = 0.0125;
    const CENTER_DAMP = 0.85;

    const particles = Array.from({ length: 260 }, makeParticle);

    const resize = () => {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      cx.val = cx.target = W / 2;
      cy.val = cy.target = H / 2;
      particles.forEach(p => {
        p.x = cx.val + Math.cos(p.angle) * p.orbitR * 0.5;
        p.y = cy.val + Math.sin(p.angle) * p.orbitR * 0.5;
      });
    };

    let mouseX = 0, mouseY = 0;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      cx.target = mouseX;
      cy.target = mouseY;
    };
    hero.addEventListener('mousemove', onMove, { passive: true });

    let idleT = 0, idleMode = true, idleTimer = null;
    const onAnyMove = () => {
      idleMode = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { idleMode = true; }, 3000);
    };
    hero.addEventListener('mousemove', onAnyMove, { passive: true });

    const ripples = [];
    let rippleTimer = 0;
    const RIPPLE_INTERVAL = 90;

    let t = 0, raf = null;

    const tick = () => {
      t++;
      idleT += 0.004;

      if (idleMode) {
        cx.target = W * 0.5 + Math.sin(idleT * 1.1) * W * 0.20;
        cy.target = H * 0.5 + Math.sin(idleT * 0.7) * H * 0.15;
      }

      cx.v += (cx.target - cx.val) * CENTER_K; cx.v *= CENTER_DAMP; cx.val += cx.v;
      cy.v += (cy.target - cy.val) * CENTER_K; cy.v *= CENTER_DAMP; cy.val += cy.v;

      rippleTimer++;
      const distToCursor = Math.hypot(mouseX - cx.val, mouseY - cy.val);
      if (rippleTimer >= RIPPLE_INTERVAL && distToCursor < 320) {
        rippleTimer = 0;
        ripples.push({ x: mouseX, y: mouseY, r: 0, age: 0, maxAge: 80, maxR: 260 });
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r = (ripples[i].age / ripples[i].maxAge) * ripples[i].maxR;
        ripples[i].age++;
        if (ripples[i].age > ripples[i].maxAge) ripples.splice(i, 1);
      }

      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.angle  += p.orbitSpeed;

        const r  = p.orbitR + Math.sin(t * p.breathFreq + p.breathPh) * p.breathAmp;
        const tx = cx.val + Math.cos(p.angle) * r;
        const ty = cy.val + Math.sin(p.angle) * r;

        p.vx += (tx - p.x) * p.lag;
        p.vy += (ty - p.y) * p.lag;

        for (const rpl of ripples) {
          const rdx = p.x - rpl.x, rdy = p.y - rpl.y;
          const d   = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
          const band       = Math.exp(-0.5 * ((d - rpl.r) / 28) ** 2);
          const lifeAlpha  = Math.sin((rpl.age / rpl.maxAge) * Math.PI);
          const strength   = band * lifeAlpha * 0.9;
          p.vx += (rdx / d) * strength;
          p.vy += (rdy / d) * strength;
        }

        p.vx *= p.drag; p.vy *= p.drag;
        p.x  += p.vx;  p.y  += p.vy;

        if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) continue;

        // orient each dash toward the cursor/center
        const toAngle = Math.atan2(cy.val - p.y, cx.val - p.x);
        const dx = Math.cos(toAngle) * p.len * 0.5;
        const dy = Math.sin(toAngle) * p.len * 0.5;
        const { r: cr, g, b } = p.col;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = `rgb(${cr | 0},${g | 0},${b | 0})`;
        ctx.lineWidth   = p.thickness;
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x - dx, p.y - dy);
        ctx.lineTo(p.x + dx, p.y + dy);
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    raf = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mousemove', onAnyMove);
      clearTimeout(idleTimer);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hp-shell">

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
        <canvas ref={canvasRef} className="hp-canvas" aria-hidden="true" />
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
            <Link to="/toolkit" className="hp-btn-primary">
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
