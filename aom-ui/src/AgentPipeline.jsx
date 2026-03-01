import { useState, useRef } from 'react';
import ParticlesBackground from './ParticlesBackground.jsx';
import './AgentPipeline.css';

const MODES = {
  wrappers: { endpoint: '/api/generate-aom', download: 'aom-wrappers.zip', label: 'Generate Wrappers' }
};

export default function AgentPipeline() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [status, setStatus] = useState("Agent pipeline ready");
  const [subStatus, setSubStatus] = useState("Upload a ZIP of your React project");

  // Magnetic Attraction State
  const [hoverType, setHoverType] = useState(null); // 'enter', 'upload', 'process', 'download'
  const enterButtonRef = useRef(null);
  const uploadNodeRef = useRef(null);
  const processNodeRef = useRef(null);
  const downloadNodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeTargetRef =
    hoverType === 'enter' ? enterButtonRef :
      hoverType === 'upload' ? uploadNodeRef :
        hoverType === 'process' ? processNodeRef :
          hoverType === 'download' ? downloadNodeRef : null;

  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setStatus(`Attached: ${file.name}`);
    setSubStatus("Click the processor to begin generation");
    setComplete(false);
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onProcessClick() {
    if (!selectedFile || loading) return;
    setLoading(true);
    setStatus("Analyzing AST...");
    setSubStatus("Extracting AOM Action wrappers...");

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await fetch(MODES.wrappers.endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Generation failed: ' + res.statusText);
      const blob = await res.blob();

      triggerDownload(blob, MODES.wrappers.download);

      setStatus("Success!");
      setSubStatus("AOM wrappers generated and downloaded.");
      setComplete(true);
      setSelectedFile(null);
    } catch (err) {
      setStatus("Error occurred");
      setSubStatus(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`ap-layout ${isStarted ? 'ap-started' : ''}`}>
      <ParticlesBackground
        hoverTargetRef={activeTargetRef}
        isHovering={!!hoverType}
      />

      <header className="ap-header">
        <div className="ap-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2zm0 4.2L18.4 19H5.6L12 6.2z" />
          </svg>
          Antigravity Studio
        </div>
        <nav className="ap-nav">
          <span>Product</span>
          <span>Resources</span>
          <span>Github</span>
        </nav>
      </header>

      <main className={`ap-hero ${isStarted ? 'ap-hero-mini' : 'ap-hero-landing'}`}>
        <h1>The World's First Agent-Native Studio</h1>
        <p>Instantly convert your React application into a deterministic Agent Object Model (AOM).</p>

        {!isStarted && (
          <div className="ap-enter-container">
            <div
              ref={enterButtonRef}
              className="ap-pill-hitbox"
              onMouseEnter={() => setHoverType('enter')}
              onMouseLeave={() => setHoverType(null)}
              onClick={() => setIsStarted(true)}
            >
              Enter Studio
            </div>
          </div>
        )}
      </main>

      {/* Stage 2: Technical Pipeline */}
      {isStarted && (
        <div className="ap-main-content">
          <div className="ap-pipeline-container ap-fade-in shadow-xl bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-12">
            <div className="ap-pipeline-flow">
              {/* Node 1: Upload */}
              <div className="ap-node">
                <div
                  ref={uploadNodeRef}
                  className={`ap-node-circle ${selectedFile ? 'success' : 'active-particle'}`}
                  onMouseEnter={() => !selectedFile && setHoverType('upload')}
                  onMouseLeave={() => setHoverType(null)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!selectedFile ? (
                    <svg className="ap-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ) : (
                    <svg className="ap-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ap-node-label">Upload</span>
                <span className="ap-node-status">{selectedFile ? selectedFile.name : "Select ZIP"}</span>
              </div>

              <div className="ap-pipe-line">
                <div className={`ap-pipe-progress ${selectedFile ? 'complete' : ''}`}></div>
              </div>

              {/* Node 2: Process */}
              <div className="ap-node">
                <div
                  ref={processNodeRef}
                  className={`ap-node-circle ${loading ? 'active' : (complete ? 'success' : 'active-particle')}`}
                  onMouseEnter={() => !loading && !complete && setHoverType('process')}
                  onMouseLeave={() => setHoverType(null)}
                  onClick={onProcessClick}
                  style={{ cursor: selectedFile ? 'pointer' : 'not-allowed', opacity: selectedFile || loading ? 1 : 0.5 }}
                >
                  {loading ? (
                    <div className="ap-ring-loader"></div>
                  ) : (
                    <svg className="ap-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <span className="ap-node-label">Process</span>
                <span className="ap-node-status">{loading ? "Analyzing..." : "AOM Extraction"}</span>
              </div>

              <div className="ap-pipe-line">
                <div className={`ap-pipe-progress ${loading ? 'loading' : (complete ? 'complete' : '')}`}></div>
              </div>

              {/* Node 3: Download */}
              <div className="ap-node">
                <div
                  ref={downloadNodeRef}
                  className={`ap-node-circle ${complete ? 'success' : 'active-particle'}`}
                  onMouseEnter={() => complete && setHoverType('download')}
                  onMouseLeave={() => setHoverType(null)}
                  style={{ opacity: complete ? 1 : 0.5 }}
                >
                  <svg className="ap-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span className="ap-node-label">Download</span>
                <span className="ap-node-status">{complete ? "Wrappers Ready" : "Awaiting Result"}</span>
              </div>
            </div>

            <div className="ap-global-status">
              <div className="ap-status-title">{status}</div>
              <div className="ap-status-sub">{subStatus}</div>
            </div>
          </div>
        </div>
      )}

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
