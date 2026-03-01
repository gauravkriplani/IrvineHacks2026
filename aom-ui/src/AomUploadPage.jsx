import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImg from './public/logo.webp';
import './HomePage.css';
import './AomUploadPage.css';

const STAGES = [
  { id: 'analysis', icon: '◈', label: 'Analysis', sub: 'Contextual mapping' },
  { id: 'synthesis', icon: '✦', label: 'Synthesis', sub: 'AOM Synthesis' },
];

function IconUpload() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AomUploadPage() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [activeStage, setActiveStage] = useState(-1);
  const fileInputRef = useRef(null);
  const timers = useRef([]);
  const pendingBlob = useRef(null);   // holds server response until animation ends
  const animDone = useRef(false);  // true once all stage timers have fired

  function clearTimers() { timers.current.forEach(clearTimeout); timers.current = []; }

  // Called when BOTH the animation and the server response are ready
  function tryFinalize() {
    if (!animDone.current || !pendingBlob.current) return;
    const url = URL.createObjectURL(pendingBlob.current);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aom-wrappers.zip';
    a.click();
    URL.revokeObjectURL(url);
    pendingBlob.current = null;
    setActiveStage(STAGES.length);
    setStatus('done');
  }

  function startStageAnimation() {
    clearTimers();
    animDone.current = false;
    setActiveStage(0);
    timers.current.push(setTimeout(() => setActiveStage(1), 3000));
    timers.current.push(setTimeout(() => {
      animDone.current = true;
      tryFinalize();
    }, 6000));
  }

  useEffect(() => () => clearTimers(), []);

  async function processFile(file) {
    if (!file || !file.name.endsWith('.zip')) {
      setError('Please upload a .zip file.');
      setStatus('error');
      return;
    }
    setFileName(file.name);
    setStatus('loading');
    setError('');
    pendingBlob.current = null;
    startStageAnimation();
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/generate-aom', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      pendingBlob.current = await res.blob();
      tryFinalize(); // download immediately if animation already finished
    } catch (e) {
      clearTimers();
      pendingBlob.current = null;
      setError(e.message);
      setStatus('error');
    }
  }

  function reset() {
    clearTimers();
    pendingBlob.current = null;
    animDone.current = false;
    setStatus('idle');
    setError('');
    setFileName('');
    setActiveStage(-1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function onFileChange(e) { processFile(e.target.files[0]); }
  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  const isLoading = status === 'loading';
  const isDone = status === 'done';
  const isError = status === 'error';

  function pipeActive(index) {
    if (isDone) return true;
    if (isLoading) return activeStage >= index;
    return false;
  }

  function stageState(i) {
    if (isDone) return 'done';
    if (isError && activeStage === i) return 'error';
    if (isLoading && activeStage === i) return 'active';
    if (isLoading && activeStage > i) return 'done';
    return 'idle';
  }

  return (
    <div className="tk-shell">

      {/* Nav */}
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
        {/* <Link to="/" className="hp-nav-cta">← Back to Home</Link> */}
      </nav>

      <main className="tk-body">

        {/* Page header */}
        <div className="tk-header">
          <div className="tk-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" fill="#22c55e" />
            </svg>
            Tool
          </div>
          <h1 className="tk-title">AOM Wrapper Generator</h1>
          <p className="tk-subtitle">
            Drop your source on the left — collect your AOM wrappers on the right.
          </p>
        </div>

        {/* Pipeline */}
        <div className="pl-pipeline">

          {/* ── INPUT NODE ── */}
          <label
            className={[
              'pl-node pl-node--io',
              dragOver ? 'pl-node--drag' : '',
              isLoading || isDone ? 'pl-node--muted' : '',
              isError ? 'pl-node--error' : '',
            ].filter(Boolean).join(' ')}
            onDragOver={(e) => { e.preventDefault(); if (!isLoading && !isDone) setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              style={{ display: 'none' }}
              onChange={onFileChange}
              disabled={isLoading || isDone}
            />
            <span className="pl-node-eyebrow">Input</span>
            <div className="pl-node-icon"><IconUpload /></div>
            <span className="pl-node-name">{fileName || 'source.zip'}</span>
            <span className="pl-node-sub">
              {isLoading || isDone ? fileName : 'Drop or click to upload'}
            </span>
          </label>

          {/* pipe 0 */}
          <div className={`pl-pipe ${pipeActive(0) ? 'pl-pipe--active' : ''}`} />

          {/* ── STAGE NODES ── */}
          {STAGES.map((stage, i) => {
            const state = stageState(i);
            return (
              <div key={stage.id} className="pl-stage-group">
                <div className={`pl-node pl-node--stage pl-node--${state}`}>
                  <div className="pl-stage-icon">
                    {state === 'done'
                      ? <IconCheck />
                      : state === 'active'
                        ? <div className="pl-stage-spinner" />
                        : <span className="pl-stage-glyph">{stage.icon}</span>
                    }
                  </div>
                  <span className="pl-node-name">{stage.label}</span>
                  <span className="pl-node-sub">{stage.sub}</span>
                </div>
                <div className={`pl-pipe ${pipeActive(i + 1) ? 'pl-pipe--active' : ''}`} />
              </div>
            );
          })}

          {/* ── OUTPUT NODE ── */}
          <div className={`pl-node pl-node--io ${isDone ? 'pl-node--output-ready' : 'pl-node--muted'}`}>
            <span className="pl-node-eyebrow">Output</span>
            <div className="pl-node-icon"><IconDownload /></div>
            <span className="pl-node-name">aom-wrappers.zip</span>
            <span className="pl-node-sub">
              {isDone ? 'Downloaded ✓' : 'Waiting for input…'}
            </span>
            {isDone && (
              <button className="pl-reset-btn" onClick={reset}>Run again</button>
            )}
          </div>

        </div>

        {/* Error message */}
        {isError && (
          <div className="pl-error-banner">
            <b>Error:</b> {error} —{' '}
            <button className="pl-error-retry" onClick={reset}>Try again</button>
          </div>
        )}

      </main>

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
