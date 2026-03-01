import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MarioPipeline.css';

const MODES = {
  wrappers: { endpoint: '/api/generate-aom', download: 'aom-wrappers.zip' },
  annotate:  { endpoint: '/api/annotate-source', download: 'annotated-source.zip' },
};

export default function MarioPipeline() {
  const [currentMode, setCurrentMode] = useState('wrappers');
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultBlob,   setResultBlob]   = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [hasFile,      setHasFile]      = useState(false);
  const [fileName,     setFileName]     = useState('');
  const [statusText,   setStatusText]   = useState('');
  const [statusCls,    setStatusCls]    = useState('');

  const fileInputRef = useRef(null);

  function applyStatus(text, cls = '') {
    setStatusText(text);
    setStatusCls(cls);
  }

  function switchMode(mode) {
    setCurrentMode(mode);
    setResultBlob(null);
    setStatusText('');
    setStatusCls('');
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onUploadClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setHasFile(true);
    setFileName(file.name);
    setResultBlob(null);
    applyStatus(`Ready — ${file.name}`);
    e.target.value = '';
  }

  async function onOutputClick() {
    if (!resultBlob) return;
    triggerDownload(resultBlob, MODES[currentMode].download);
  }

  async function onPlayClick() {
    if (!selectedFile) {
      applyStatus('Please upload a ZIP file first.', 'error');
      return;
    }

    // new Audio('/pipe-sound.mp3').play().catch(() => {});

    setLoading(true);
    setResultBlob(null);
    applyStatus('Processing…');

    try {
      const form = new FormData();
      form.append('file', selectedFile);

      const res = await fetch(MODES[currentMode].endpoint, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Server error ${res.status}`);
      }

      const blob = await res.blob();
      setResultBlob(blob);
      applyStatus('Done — click Output to download.', 'done');
    } catch (err) {
      applyStatus(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  const isPulsing = loading;

  return (
    <div className="app-shell">

      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Nav bar */}
      <nav className="app-nav">
        <Link to="/" className="nav-brand">Agent Native</Link>
        <Link to="/" className="nav-back">← Home</Link>
      </nav>

      {/* Hero text */}
      <div className="hero">
        <h1 className="hero-title">AOM Toolkit</h1>
        <p className="hero-sub">Generate accessibility wrappers and annotate your source code.</p>
      </div>

      {/* Main card */}
      <div className="card">

        {/* Mode segmented control */}
        <div className="mode-toggle" role="tablist">
          <button
            className={`mode-btn${currentMode === 'wrappers' ? ' active' : ''}`}
            role="tab"
            aria-selected={currentMode === 'wrappers'}
            onClick={() => switchMode('wrappers')}
          >
            Generate Wrappers
          </button>
          <button
            className={`mode-btn${currentMode === 'annotate' ? ' active' : ''}`}
            role="tab"
            aria-selected={currentMode === 'annotate'}
            onClick={() => switchMode('annotate')}
          >
            Annotate Source
          </button>
        </div>

        {/* Workflow row: upload → run → output */}
        <div className="workflow">

          {/* Upload zone */}
          <div
            className={`zone${hasFile ? ' has-file' : ''}`}
            onClick={onUploadClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onUploadClick()}
            aria-label="Upload ZIP file"
          >
            <div className="zone-icon">
              {hasFile ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              )}
            </div>
            <span className="zone-label">Input</span>
            <span className="zone-title">{hasFile ? fileName : 'Upload ZIP'}</span>
            <span className="zone-hint">{hasFile ? 'Click to replace' : 'Select a .zip file'}</span>
          </div>

          {/* Left connector */}
          <div className="connector">
            <div className="connector-line" />
          </div>

          {/* Run button */}
          <div className="run-wrap">
            <button
              className={`run-btn${loading ? ' loading' : ''}`}
              onClick={onPlayClick}
              disabled={loading}
              aria-label="Run pipeline"
            >
              {loading && <span className="spinner" />}
              {loading ? 'Running…' : 'Run'}
            </button>
          </div>

          {/* Right connector */}
          <div className="connector">
            <div className="connector-line" />
          </div>

          {/* Output zone */}
          <div
            className={`zone${resultBlob ? ' has-result' : ' inactive'}`}
            onClick={onOutputClick}
            role="button"
            tabIndex={resultBlob ? 0 : -1}
            onKeyDown={e => e.key === 'Enter' && onOutputClick()}
            aria-label={resultBlob ? 'Download result' : 'Output'}
          >
            <div className="zone-icon">
              {resultBlob ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 8 12 12 14 14"/>
                </svg>
              )}
            </div>
            <span className="zone-label">Output</span>
            <span className="zone-title">{resultBlob ? MODES[currentMode].download : 'Result'}</span>
            <span className="zone-hint">{resultBlob ? 'Click to download' : 'Appears after run'}</span>
          </div>
        </div>

        {/* Status message */}
        {statusText && (
          <div className={`status-bar${statusCls ? ' ' + statusCls : ''}`}>
            <span className={`status-dot${isPulsing ? ' pulsing' : ''}`} />
            {statusText}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">IrvineHacks 2026</footer>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  );
}
