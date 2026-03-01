import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from './public/logo.webp';
import maanPhoto from './public/maanpatel.jpeg';
import gauravPhoto from './public/gauravkriplani.png';
import adityaPhoto from './public/adityajain.jpeg';
import justinPhoto from './public/justinsiek.jpeg';
import './HomePage.css';
import './TeamsPage.css';

const TEAM = [
  {
    name: 'Maan Patel',
    role: 'Student',
    school: 'University of California, Irvine',
    photo: maanPhoto,
    github: 'https://github.com/maanpatel2005',
    linkedin: 'https://www.linkedin.com/in/maanvpatel/',
  },
  {
    name: 'Gaurav Kriplani',
    role: 'Student',
    school: 'University of California, Irvine',
    photo: gauravPhoto,
    github: 'https://github.com/gauravkriplani',
    linkedin: 'https://www.linkedin.com/in/gaurav-kriplani/',
  },
  {
    name: 'Aditya Jain',
    role: 'Student',
    school: 'University of California, Irvine',
    photo: adityaPhoto,
    github: 'https://github.com/adityaj0',
    linkedin: 'https://www.linkedin.com/in/aditya-jain0714/',
  },
  {
    name: 'Justin Siek',
    role: 'Student',
    school: 'University of California, Irvine',
    photo: justinPhoto,
    github: 'https://github.com/justinsiek',
    linkedin: 'https://www.linkedin.com/in/justin-siek/',
  },
];

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
               0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
               -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088
               2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
               0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
               0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115
               2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1
               2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566
               4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747
               0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
               0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046
               c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267
               5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065
               2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
    </svg>
  );
}

export default function TeamsPage() {
  return (
    <div className="hp-shell tm-shell">

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav className="hp-nav">
        <Link to="/" className="hp-nav-brand">
          <img src={logoImg} alt="Agent Native logo" className="hp-nav-logo" />
          Agent Native
        </Link>
        <div className="hp-nav-center">
          <Link to="/toolkit" className="hp-nav-link">Product</Link>
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" className="hp-nav-link" target="_blank" rel="noreferrer">GitHub</a>
          <Link to="/team" className="hp-nav-link">About Us</Link>
        </div>
      </nav>

      {/* ── Main Body ─────────────────────────────────────────────── */}
      <div className="tm-body">
        {/* ── Hero header ───────────────────────────────────────────── */}
        <section className="tm-header">
          <p className="hp-eyebrow">Built at IrvineHacks 2026</p>
          <h1 className="tm-title">About Us</h1>
          <p className="tm-sub">
            We're a team of four students passionate about making the web more accessible
            through AI-powered tooling. [insert team tagline / mission statement here]
          </p>
        </section>

        {/* ── Team grid ─────────────────────────────────────────────── */}
        <section className="tm-grid-section">
          <div className="tm-grid">
            {TEAM.map((member) => (
              <div className="tm-card" key={member.name}>
                <div className="tm-avatar">
                  <img src={member.photo} alt={member.name} className="tm-avatar-img" />
                </div>
                <div className="tm-info">
                  <div className="tm-name">{member.name}</div>
                  <div className="tm-role">{member.role}</div>
                  <div className="tm-school">{member.school}</div>
                  <p className="tm-bio">{member.bio}</p>
                  <div className="tm-links">
                    <a href={member.github} className="tm-icon-link" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>
                    <a href={member.linkedin} className="tm-icon-link" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

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
