import { useState } from 'react';

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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>AOM Wrapper Generator</h1>
        <p style={styles.subtitle}>
          Upload a <code>.zip</code> of your <code>src/</code> folder and download
          the generated AOM wrapper artifacts.
        </p>

        <label
          style={{ ...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {}) }}
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
            <span style={styles.spinner}>⏳ Generating wrappers…</span>
          ) : (
            <>
              <span style={styles.uploadIcon}>📦</span>
              <span style={styles.dropText}>
                Drag &amp; drop your <b>source.zip</b> here, or <u>click to browse</u>
              </span>
            </>
          )}
        </label>

        {status === 'done' && (
          <div style={styles.success}>✅ <b>aom-wrappers.zip</b> downloaded successfully!</div>
        )}
        {status === 'error' && (
          <div style={styles.errorBox}>❌ {error}</div>
        )}

        <div style={styles.info}>
          <b>How it works:</b>
          <ol style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Zip your project's <code>src/</code> folder.</li>
            <li>Upload it here.</li>
            <li>
              Download <code>aom-wrappers.zip</code> containing per-file wrapper
              metadata and a <code>manifest.json</code>.
            </li>
            <li>
              Drop the <code>AI/</code> folder into your project and use the
              metadata to accelerate agent workflows.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f0f',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: 24,
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 16,
    padding: '40px 36px',
    maxWidth: 560,
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    color: '#f0f0f0',
  },
  title: { margin: '0 0 8px', fontSize: 26, fontWeight: 700 },
  subtitle: { margin: '0 0 28px', color: '#aaa', fontSize: 14, lineHeight: 1.6 },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    border: '2px dashed #444',
    borderRadius: 12,
    padding: '40px 24px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    background: '#111',
    marginBottom: 20,
  },
  dropZoneActive: {
    borderColor: '#4f8ef7',
    background: '#1b2a44',
  },
  uploadIcon: { fontSize: 40 },
  dropText: { color: '#bbb', fontSize: 14, textAlign: 'center' },
  spinner: { color: '#4f8ef7', fontSize: 16, fontWeight: 600 },
  success: {
    background: '#0d2e17',
    border: '1px solid #2a7a44',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#4caf7d',
    marginBottom: 20,
    fontSize: 14,
  },
  errorBox: {
    background: '#2e0d0d',
    border: '1px solid #7a2a2a',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#cf6679',
    marginBottom: 20,
    fontSize: 14,
  },
  info: {
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 13,
    color: '#aaa',
  },
};
