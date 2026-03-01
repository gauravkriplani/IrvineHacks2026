import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import './AomUploadPage.css';

export default function AomUploadPage() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function processFile(file) {
    if (!file || !file.name.endsWith('.zip')) {
      setError('Please upload a .zip file.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/generate-aom', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aom-wrappers.zip';
      a.click();
      URL.revokeObjectURL(url);
      setStatus('done');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }

  function onFileChange(e) {
    processFile(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  const dropClass = [
    'tk-drop',
    dragOver ? 'tk-drop--active' : '',
    status === 'loading' ? 'tk-drop--loading' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="tk-shell">
      {/* Nav — identical to homepage */}
      <nav className="hp-nav">
        <Link to="/" className="hp-nav-brand">
          <svg className="hp-nav-logo" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <polygon points="14,2 26,24 2,24" fill="#1a1a1a" />
            <polygon points="14,7 23,22 11,22" fill="#4285f4" opacity="0.75" />
          </svg>
          Agent Native
        </Link>
        <div className="hp-nav-center">
          <Link to="/" className="hp-nav-link">Home</Link>
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" className="hp-nav-link" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.w3.org/TR/wai-aria-1.2/" className="hp-nav-link" target="_blank" rel="noreferrer">WAI-ARIA</a>
        </div>
        <Link to="/" className="hp-nav-cta">← Back to Home</Link>
      </nav>

      {/* Body */}
      <main className="tk-body">
        <div className="tk-card">
          {/* Header */}
          <div className="tk-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" fill="#22c55e"/>
            </svg>
            Tool
          </div>
          <h1 className="tk-title">AOM Wrapper Generator</h1>
          <p className="tk-subtitle">
            Upload a <code>.zip</code> of your <code>src/</code> folder and
            download the generated AOM wrapper artifacts in seconds.
          </p>

          {/* Drop zone */}
          <label
            className={dropClass}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".zip"
              style={{ display: 'none' }}
              onChange={onFileChange}
              disabled={status === 'loading'}
            />
            {status === 'loading' ? (
              <div className="tk-drop-loading">
                <div className="tk-spinner-ring" />
                <span className="tk-spinner-label">Generating wrappers…</span>
              </div>
            ) : (
              <>
                <div className="tk-drop-icon">📦</div>
                <p className="tk-drop-text">
                  Drag &amp; drop your <b>source.zip</b> here,{' '}
                  or <u>click to browse</u>
                </p>
              </>
            )}
          </label>

          {/* Status banners */}
          {status === 'done' && (
            <div className="tk-banner tk-banner--success">
              <span className="tk-banner-icon">✓</span>
              <span><b>aom-wrappers.zip</b> downloaded successfully!</span>
            </div>
          )}
          {status === 'error' && (
            <div className="tk-banner tk-banner--error">
              <span className="tk-banner-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <div className="tk-divider" />

          {/* How it works */}
          <p className="tk-how-title">How it works</p>
          <ol className="tk-steps">
            {[
              <>Zip your project's <code>src/</code> folder.</>,
              <>Upload it using the drop zone above.</>,
              <>Download <code>aom-wrappers.zip</code> — per-file wrapper metadata and a <code>manifest.json</code>.</>,
              <>Drop the <code>AI/</code> folder into your project and use the metadata to accelerate agent workflows.</>,
            ].map((text, i) => (
              <li key={i} className="tk-step">
                <span className="tk-step-num">{i + 1}</span>
                <span className="tk-step-text">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>

      {/* Footer — identical to homepage */}
      <footer className="hp-footer">
        <span className="hp-footer-brand">Agent Native</span>
        <span>&copy; 2026 IrvineHacks2026 Team</span>
        <div className="hp-footer-links">
          <a href="https://github.com/gauravkriplani/IrvineHacks2026" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
