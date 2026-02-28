import { useState, useRef } from 'react';
import './MarioPipeline.css';

const MODES = {
  wrappers: { endpoint: '/api/generate-aom',    download: 'aom-wrappers.zip',     label: 'Generate Wrappers' },
  annotate: { endpoint: '/api/annotate-source', download: 'annotated-source.zip', label: 'Annotate Source'   },
};

// ── Reusable cloud shapes ───────────────────────────────────────────────────
function CloudLarge({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 96 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2H40V4H44V10H50V6H54V2H74V4H76V10H80V16H90V18H94V32H90V38H86V42H74V40H66V42H62V44H54V42H50V40H48V42H40V40H34V44H22V42H18V40H16V38H6V34H2V22H6V18H16V10H18V6H22V2Z" fill="white"/>
      <path d="M68 8H66V14H68V8Z" fill="black"/><path d="M60 8H62V14H60V8Z" fill="black"/><path d="M36 8H34V14H36V8Z" fill="black"/><path d="M28 8H30V14H28V8Z" fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M38 0H26V2H22V4H20V6H18V10H16V14H14V16H10V18H6V20H4V22H2V26H0V30H2V34H4V36H6V38H10V40H16V42H18V44H22V46H30V44H34V42H36V40H38V42H42V44H48V42H50V44H54V46H62V44H66V42H68V40H70V42H74V44H82V42H86V40H88V38H90V34H92V32H94V28H96V22H94V18H92V16H88V14H80V10H78V6H76V4H74V2H70V0H58V2H54V4H52V6H50V10H46V6H44V4H42V2H38V0ZM38 2V4H42V6H44V10H46V14H50V10H52V6H54V4H58V2H70V4H74V6H76V10H78V14H80V16H88V18H92V22H94V28H92V32H88V38H86V40H82V42H74V40H70V38H66V42H62V44H54V42H50V40H48V42H42V40H38V38H34V42H30V44H22V42H18V40H16V38H10V36H6V34H4V30H2V26H4V22H6V20H10V18H16V14H18V10H20V6H22V4H26V2H38Z" fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M40 8H42V10H40V8ZM42 10H44V14H42V10Z" fill="#93FCEE"/>
      <path d="M8 32H6V34H8V32Z" fill="#93FCEE"/><path d="M10 34H14V32H16V30H18V34H16V36H10V34Z" fill="#93FCEE"/>
      <path d="M22 38H20V40H22V42H30V40H32V38H34V32H30V38H28V40H22V38Z" fill="#93FCEE"/>
      <path d="M42 36H40V38H42V36Z" fill="#93FCEE"/><path d="M44 38H48V40H44V38Z" fill="#93FCEE"/>
      <path d="M50 30H48V34H50V30Z" fill="#93FCEE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M52 38H54V40H52V38ZM54 40H60V38H62V32H66V38H64V40H62V42H54V40Z" fill="#93FCEE"/>
      <path d="M72 36H74V38H72V36Z" fill="#93FCEE"/><path d="M80 38H76V40H80V38Z" fill="#93FCEE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M88 22H86V20H88V22ZM88 22V26H86V28H80V30H82V36H80V38H84V36H86V30H88V28H90V22H88Z" fill="#93FCEE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M74 8H72V10H74V8ZM74 10H76V14H74V10Z" fill="#93FCEE"/>
    </svg>
  );
}

function CloudSmall({ width, height }) {
  return (
    <svg width={width} height={height} viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.25 1.73914H36.75V3.47827H38.5V8.69566H42V13.913H50.75V15.6522H54.25V27.8261H50.75V33.0435H47.25V36.5217H36.75V34.7826H29.75V36.5217H26.25V38.2609H19.25V36.5217H15.75V34.7826H12.25V33.0435H5.25V29.5652H1.75V19.1304H5.25V15.6522H12.25V12.1739H15.75V5.2174H19.25V1.73914Z" fill="white"/>
      <path d="M31.5 6.95652H29.75V12.1739H31.5V6.95652Z" fill="black"/><path d="M24.5 6.95652H26.25V12.1739H24.5V6.95652Z" fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M33.25 0H22.75V1.73913H19.25V3.47826H17.5V5.21739H15.75V8.69565H14V12.1739H12.25V13.913H8.75V15.6522H5.25V17.3913H3.5V19.1304H1.75V22.6087H0V26.087H1.75V29.5652H3.5V31.3043H5.25V33.0435H8.75V34.7826H14V36.5217H15.75V38.2609H19.25V40H26.25V38.2609H29.75V36.5217H31.5V34.7826H33.25V36.5217H36.75V38.2609H43.75V36.5217H47.25V34.7826H49V33.0435H50.75V29.5652H52.5V27.8261H54.25V24.3478H56V19.1304H54.25V15.6522H52.5V13.913H49V12.1739H42V8.69565H40.25V5.21739H38.5V3.47826H36.75V1.73913H33.25V0ZM33.25 1.73913V3.47826H36.75V5.21739H38.5V8.69565H40.25V12.1739H42V13.913H49V15.6522H52.5V19.1304H54.25V24.3478H52.5V27.8261H49V33.0435H47.25V34.7826H43.75V36.5217H36.75V34.7826H33.25V33.0435H29.75V36.5217H26.25V38.2609H19.25V36.5217H15.75V34.7826H14V33.0435H8.75V31.3043H5.25V29.5652H3.5V26.087H1.75V22.6087H3.5V19.1304H5.25V17.3913H8.75V15.6522H14V12.1739H15.75V8.69565H17.5V5.21739H19.25V3.47826H22.75V1.73913H33.25Z" fill="black"/>
      <path d="M36.75 6.95651H35V8.69564H36.75V12.1739H38.5V8.69564H36.75V6.95651Z" fill="#93FCEE"/>
      <path d="M49 17.3913H47.25V19.1304H49V22.6087H47.25V24.3478H42V26.0869H43.75V31.3043H42V33.0435H38.5V34.7826H42V33.0435H45.5V31.3043H47.25V26.0869H49V24.3478H50.75V19.1304H49V17.3913Z" fill="#93FCEE"/>
      <path d="M15.75 26.0869H14V27.8261H12.25V29.5652H8.75V31.3043H14V29.5652H15.75V26.0869Z" fill="#93FCEE"/>
      <path d="M7 27.8261H5.25V29.5652H7V27.8261Z" fill="#93FCEE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M17.5 33.0435H19.25V34.7826H17.5V33.0435ZM19.25 34.7826H24.5V33.0435H26.25V27.8261H29.75V33.0435H28V34.7826H26.25V36.5217H19.25V34.7826Z" fill="#93FCEE"/>
      <path d="M35 31.3043H36.75V33.0435H35V31.3043Z" fill="#93FCEE"/>
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function MarioPipeline() {
  const [currentMode, setCurrentMode] = useState('wrappers');
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultBlob, setResultBlob]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [hasFile, setHasFile]           = useState(false);
  const [fileName, setFileName]         = useState('file.zip');
  const [statusText, setStatusText]     = useState('');
  const [statusCls, setStatusCls]       = useState('hidden');

  const fileInputRef = useRef(null);

  function applyStatus(text, cls = '') {
    setStatusText(text);
    setStatusCls(cls || '');
  }

  function switchMode(id) {
    setCurrentMode(id);
    setResultBlob(null);
    applyStatus('', 'hidden');
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onUploadClick() {
    if (loading) return;
    fileInputRef.current.click();
  }

  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    let name = file.name;
    if (name.length > 12) name = name.slice(0, 10) + '…';
    setFileName(name);
    setHasFile(true);
    setResultBlob(null);
    applyStatus('File ready — press play!', '');
  }

  function onOutputClick() {
    if (!resultBlob) return;
    triggerDownload(resultBlob, MODES[currentMode].download);
  }

  async function onPlayClick() {
    new Audio('/pipe-sound.mp3').play().catch(() => {});
    if (!selectedFile) {
      applyStatus('Upload a .zip first!', 'error');
      return;
    }
    if (loading) return;

    setLoading(true);
    setResultBlob(null);
    applyStatus('Processing…', '');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await fetch(MODES[currentMode].endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Server error ' + res.status);
      const blob = await res.blob();
      triggerDownload(blob, MODES[currentMode].download);
      setResultBlob(blob);
      applyStatus('✓ ' + MODES[currentMode].download + ' downloaded!', 'done');
    } catch (err) {
      applyStatus('✗ ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const statusClass = `status-msg${statusCls ? ' ' + statusCls : ''}`;

  return (
    <div className="scene">

      {/* ── TITLE ── */}
      <div className="mario-title">Agent Native</div>

      {/* ── CLOUDS ── */}
      <div className="cloud cloud-1"><CloudLarge width={130} height={62} /></div>
      <div className="cloud cloud-2"><CloudSmall width={56}  height={40} /></div>
      <div className="cloud cloud-3"><CloudLarge width={80}  height={38} /></div>
      <div className="cloud cloud-4"><CloudSmall width={42}  height={30} /></div>
      <div className="cloud cloud-5"><CloudLarge width={96}  height={46} /></div>
      <div className="cloud cloud-6"><CloudSmall width={70}  height={50} /></div>
      <div className="cloud cloud-7"><CloudLarge width={110} height={52} /></div>
      <div className="cloud cloud-8"><CloudSmall width={48}  height={34} /></div>
      <div className="cloud cloud-9"><CloudLarge width={88}  height={42} /></div>
      <div className="cloud cloud-10"><CloudSmall width={60} height={43} /></div>

      {/* ── MAIN LAYOUT ── */}
      <div className="main-layout">

        {/* LEFT: Upload panel */}
        <button
          className={`panel-btn upload-panel${hasFile ? ' has-file' : ''}`}
          onClick={onUploadClick}
          title="Upload ZIP file"
        >
          {/* Empty state: plus icon */}
          {!hasFile && (
            <svg width="106" height="113" viewBox="0 0 106 113" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="94" height="111" fill="#FCFCFC"/>
              <path d="M94 2H95V3H94V2Z" fill="#93FCEE"/><path d="M92 1H94V3H92V1Z" fill="#93FCEE"/>
              <rect x="92" y="3" width="3" height="108" fill="#93FCEE"/>
              <rect x="2" y="111" width="92" height="1" fill="#93FCEE"/>
              <rect x="1" y="110" width="1" height="1" fill="#93FCEE"/>
              <rect y="2" width="1" height="109" fill="black"/>
              <rect x="95" y="2" width="2" height="109" fill="black"/>
              <rect x="2" width="92" height="1" fill="black"/>
              <rect x="2" y="112" width="92" height="1" fill="black"/>
              <path d="M96 0V2H94V0L96 0Z" fill="black"/><path d="M97 1V2H94V1L97 1Z" fill="black"/>
              <path d="M96 113V111H94V113H96Z" fill="black"/><path d="M97 112V111H94V112H97Z" fill="black"/>
              <path d="M0 1H2V2H0V1Z" fill="black"/><path d="M1 0H2V2H1V0Z" fill="black"/>
              <path d="M1 113L1 111H2V113H1Z" fill="black"/><path d="M0 112L0 111H2V112H0Z" fill="black"/>
              <path d="M7 2H3V3H2V7H3V8H7V7H8V3H7V2Z" fill="black"/>
              <path d="M6 3H4V4H3V6H4V7H6V6H7V4H6V3Z" fill="#93FCEE"/>
              <rect x="4" y="5" width="1" height="1" fill="black"/><rect x="5" y="4" width="1" height="1" fill="black"/>
              <path d="M93 2H89V3H88V7H89V8H93V7H94V3H93V2Z" fill="black"/>
              <path d="M92 3H90V4H89V6H90V7H92V6H93V4H92V3Z" fill="#93FCEE"/>
              <rect x="90" y="5" width="1" height="1" fill="black"/><rect x="91" y="4" width="1" height="1" fill="black"/>
              <path d="M93 105H89V106H88V110H89V111H93V110H94V106H93V105Z" fill="black"/>
              <path d="M92 106H90V107H89V109H90V110H92V109H93V107H92V106Z" fill="#93FCEE"/>
              <rect x="90" y="108" width="1" height="1" fill="black"/><rect x="91" y="107" width="1" height="1" fill="black"/>
              <path d="M7 105H3V106H2V110H3V111H7V110H8V106H7V105Z" fill="black"/>
              <path d="M6 106H4V107H3V109H4V110H6V109H7V107H6V106Z" fill="#93FCEE"/>
              <rect x="4" y="108" width="1" height="1" fill="black"/><rect x="5" y="107" width="1" height="1" fill="black"/>
              {/* Plus sign */}
              <rect x="47" y="30" width="6" height="50" fill="#ccc"/>
              <rect x="28" y="49" width="44" height="6" fill="#ccc"/>
            </svg>
          )}
          {/* Loaded state: file icon with name */}
          {hasFile && (
            <svg width="106" height="113" viewBox="0 0 106 113" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="94" height="111" fill="#FCFCFC"/>
              <path d="M94 2H95V3H94V2Z" fill="#93FCEE"/><path d="M92 1H94V3H92V1Z" fill="#93FCEE"/>
              <rect x="92" y="3" width="3" height="108" fill="#93FCEE"/>
              <rect x="2" y="111" width="92" height="1" fill="#93FCEE"/>
              <rect x="1" y="110" width="1" height="1" fill="#93FCEE"/>
              <rect y="2" width="1" height="109" fill="black"/>
              <rect x="95" y="2" width="2" height="109" fill="black"/>
              <rect x="2" width="92" height="1" fill="black"/>
              <rect x="2" y="112" width="92" height="1" fill="black"/>
              <path d="M96 0V2H94V0L96 0Z" fill="black"/><path d="M97 1V2H94V1L97 1Z" fill="black"/>
              <path d="M96 113V111H94V113H96Z" fill="black"/><path d="M97 112V111H94V112H97Z" fill="black"/>
              <path d="M0 1H2V2H0V1Z" fill="black"/><path d="M1 0H2V2H1V0Z" fill="black"/>
              <path d="M1 113L1 111H2V113H1Z" fill="black"/><path d="M0 112L0 111H2V112H0Z" fill="black"/>
              <path d="M7 2H3V3H2V7H3V8H7V7H8V3H7V2Z" fill="black"/>
              <path d="M6 3H4V4H3V6H4V7H6V6H7V4H6V3Z" fill="#93FCEE"/>
              <rect x="4" y="5" width="1" height="1" fill="black"/><rect x="5" y="4" width="1" height="1" fill="black"/>
              <path d="M93 2H89V3H88V7H89V8H93V7H94V3H93V2Z" fill="black"/>
              <path d="M92 3H90V4H89V6H90V7H92V6H93V4H92V3Z" fill="#93FCEE"/>
              <rect x="90" y="5" width="1" height="1" fill="black"/><rect x="91" y="4" width="1" height="1" fill="black"/>
              <path d="M93 105H89V106H88V110H89V111H93V110H94V106H93V105Z" fill="black"/>
              <path d="M92 106H90V107H89V109H90V110H92V109H93V107H92V106Z" fill="#93FCEE"/>
              <rect x="90" y="108" width="1" height="1" fill="black"/><rect x="91" y="107" width="1" height="1" fill="black"/>
              <path d="M7 105H3V106H2V110H3V111H7V110H8V106H7V105Z" fill="black"/>
              <path d="M6 106H4V107H3V109H4V110H6V109H7V107H6V106Z" fill="#93FCEE"/>
              <rect x="4" y="108" width="1" height="1" fill="black"/><rect x="5" y="107" width="1" height="1" fill="black"/>
              {/* File lines */}
              <rect x="20" y="35" width="60" height="4" fill="#41D83D"/>
              <rect x="20" y="45" width="60" height="4" fill="#41D83D"/>
              <rect x="20" y="55" width="40" height="4" fill="#41D83D"/>
              <text x="48" y="80" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#333">{fileName}</text>
            </svg>
          )}
        </button>

        {/* CENTER: Pipe + play button */}
        <div className="pipe-center">

          {/* Horizontal pipe (desktop) */}
          <div className="pipe-horizontal-container">
            <svg viewBox="0 0 352 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <g clipPath="url(#ch)">
                <rect x="336" y="1" width="30" height="400" transform="rotate(90 336 1)" fill="black"/>
                <rect x="336" y="2" width="28" height="400" transform="rotate(90 336 2)" fill="#41D83D"/>
                <path d="M336 19V30L-64 30V19L336 19Z" fill="#009F00"/>
                <path d="M336 12V18L-64 18V12L336 12Z" fill="#009F00"/>
                <path d="M336 9V11L-64 11V9L336 9Z" fill="#009F00"/>
                <path d="M336 2V4L-64 4V2L336 2Z" fill="#009F00"/>
                <path d="M336 5V6L-64 6V5L336 5Z" fill="#009F00"/>
                <path d="M336 29V30H-64V29H336Z" fill="black"/>
                <path d="M336 22V23L-64 23V22L336 22Z" fill="black"/>
                <path d="M336 20V21L-64 21V20L336 20Z" fill="black"/>
                <path d="M336 24V28H-64V24L336 24Z" fill="black"/>
              </g>
              <rect x="352" width="32" height="16" transform="rotate(90 352 0)" fill="black"/>
              <rect x="351" y="1" width="30" height="13" transform="rotate(90 351 1)" fill="#41D83D"/>
              <path d="M350 20V31H338V20H350Z" fill="#009F00"/>
              <path d="M350 11V19H338V11H350Z" fill="#009F00"/>
              <path d="M350 8V10H338V8H350Z" fill="#009F00"/>
              <path d="M350 1V3L338 3V1L350 1Z" fill="#009F00"/>
              <path d="M350 4V5L338 5V4L350 4Z" fill="#009F00"/>
              <path d="M350 30V31H338V30H350Z" fill="black"/>
              <path d="M350 23V24H338V23H350Z" fill="black"/>
              <path d="M350 21V22H338V21H350Z" fill="black"/>
              <path d="M350 25V29H338V25H350Z" fill="black"/>
              <rect width="32" height="16" transform="matrix(0 1 1 0 0 0)" fill="black"/>
              <rect width="30" height="13" transform="matrix(0 1 1 0 1 1)" fill="#41D83D"/>
              <path d="M2 20L2 31H14V20H2Z" fill="#009F00"/>
              <path d="M2 11L2 19H14L14 11H2Z" fill="#009F00"/>
              <path d="M2 8V10H14V8H2Z" fill="#009F00"/>
              <path d="M2 1L2 3L14 3V1L2 1Z" fill="#009F00"/>
              <path d="M2 4V5L14 5V4L2 4Z" fill="#009F00"/>
              <path d="M2 30L2 31H14V30H2Z" fill="black"/>
              <path d="M2 23V24H14V23H2Z" fill="black"/>
              <path d="M2 21V22H14V21H2Z" fill="black"/>
              <path d="M2 25L2 29H14V25H2Z" fill="black"/>
              <defs>
                <clipPath id="ch">
                  <rect width="30" height="320" fill="white" transform="matrix(0 1 -1 0 336 1)"/>
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Play button */}
          <button className={`play-btn${loading ? ' loading' : ''}`} onClick={onPlayClick} aria-label="Run AOM pipeline">
            <div className="play-btn-inner" />
            <div className="play-btn-border" />
            <div className="play-btn-shadow-tr" /><div className="play-btn-shadow-r" />
            <div className="play-btn-shadow-b" /><div className="play-btn-shadow-bl" />
            <div className="rivets">
              <div className="rivet rivet-tl" /><div className="rivet rivet-tr" />
              <div className="rivet rivet-bl" /><div className="rivet rivet-br" />
            </div>
            <div className="play-icon" />
          </button>

          {/* Vertical pipe (mobile) — same stripe pattern as horizontal, transposed */}
          <div className="pipe-vertical-container">
            <svg viewBox="0 0 32 202" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <g clipPath="url(#clipV)">
                <rect x="1"  y="16" width="30" height="400" fill="black"/>
                <rect x="2"  y="16" width="28" height="400" fill="#41D83D"/>
                <rect x="19" y="16" width="11" height="400" fill="#009F00"/>
                <rect x="12" y="16" width="6"  height="400" fill="#009F00"/>
                <rect x="9"  y="16" width="2"  height="400" fill="#009F00"/>
                <rect x="2"  y="16" width="2"  height="400" fill="#009F00"/>
                <rect x="5"  y="16" width="1"  height="400" fill="#009F00"/>
                <rect x="29" y="16" width="1"  height="400" fill="black"/>
                <rect x="22" y="16" width="1"  height="400" fill="black"/>
                <rect x="20" y="16" width="1"  height="400" fill="black"/>
                <rect x="24" y="16" width="4"  height="400" fill="black"/>
              </g>
              {/* Top cap */}
              <rect x="0"  y="0" width="32" height="16" fill="black"/>
              <rect x="1"  y="1" width="30" height="13" fill="#41D83D"/>
              <rect x="19" y="2" width="11" height="12" fill="#009F00"/>
              <rect x="12" y="2" width="6"  height="12" fill="#009F00"/>
              <rect x="9"  y="2" width="2"  height="12" fill="#009F00"/>
              <rect x="2"  y="2" width="2"  height="12" fill="#009F00"/>
              <rect x="5"  y="2" width="1"  height="12" fill="#009F00"/>
              <rect x="29" y="2" width="1"  height="12" fill="black"/>
              <rect x="22" y="2" width="1"  height="12" fill="black"/>
              <rect x="20" y="2" width="1"  height="12" fill="black"/>
              <rect x="24" y="2" width="4"  height="12" fill="black"/>
              {/* Bottom cap */}
              <rect x="0"  y="186" width="32" height="16" fill="black"/>
              <rect x="1"  y="188" width="30" height="13" fill="#41D83D"/>
              <rect x="19" y="188" width="11" height="12" fill="#009F00"/>
              <rect x="12" y="188" width="6"  height="12" fill="#009F00"/>
              <rect x="9"  y="188" width="2"  height="12" fill="#009F00"/>
              <rect x="2"  y="188" width="2"  height="12" fill="#009F00"/>
              <rect x="5"  y="188" width="1"  height="12" fill="#009F00"/>
              <rect x="29" y="188" width="1"  height="12" fill="black"/>
              <rect x="22" y="188" width="1"  height="12" fill="black"/>
              <rect x="20" y="188" width="1"  height="12" fill="black"/>
              <rect x="24" y="188" width="4"  height="12" fill="black"/>
              <defs>
                <clipPath id="clipV">
                  <rect x="1" y="16" width="30" height="170"/>
                </clipPath>
              </defs>
            </svg>
          </div>

        </div>{/* /pipe-center */}

        {/* RIGHT: Output panel */}
        <button
          className={`panel-btn output-panel${resultBlob ? ' has-result' : ''}`}
          onClick={onOutputClick}
          title={resultBlob ? `Click to re-download ${MODES[currentMode].download}` : 'Output (click play to generate)'}
        >
          <svg width="106" height="113" viewBox="0 0 106 113" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="94" height="111" fill="#FCFCFC"/>
            <path d="M94 2H95V3H94V2Z" fill="#93FCEE"/><path d="M92 1H94V3H92V1Z" fill="#93FCEE"/>
            <rect x="92" y="3" width="3" height="108" fill="#93FCEE"/>
            <rect x="2" y="111" width="92" height="1" fill="#93FCEE"/>
            <rect x="1" y="110" width="1" height="1" fill="#93FCEE"/>
            <rect y="2" width="1" height="109" fill="black"/>
            <rect x="95" y="2" width="2" height="109" fill="black"/>
            <rect x="2" width="92" height="1" fill="black"/>
            <rect x="2" y="112" width="92" height="1" fill="black"/>
            <path d="M96 0V2H94V0L96 0Z" fill="black"/><path d="M97 1V2H94V1L97 1Z" fill="black"/>
            <path d="M96 113V111H94V113H96Z" fill="black"/><path d="M97 112V111H94V112H97Z" fill="black"/>
            <path d="M0 1H2V2H0V1Z" fill="black"/><path d="M1 0H2V2H1V0Z" fill="black"/>
            <path d="M1 113L1 111H2V113H1Z" fill="black"/><path d="M0 112L0 111H2V112H0Z" fill="black"/>
            <path d="M7 2H3V3H2V7H3V8H7V7H8V3H7V2Z" fill="black"/>
            <path d="M6 3H4V4H3V6H4V7H6V6H7V4H6V3Z" fill="#93FCEE"/>
            <rect x="4" y="5" width="1" height="1" fill="black"/><rect x="5" y="4" width="1" height="1" fill="black"/>
            <path d="M93 2H89V3H88V7H89V8H93V7H94V3H93V2Z" fill="black"/>
            <path d="M92 3H90V4H89V6H90V7H92V6H93V4H92V3Z" fill="#93FCEE"/>
            <rect x="90" y="5" width="1" height="1" fill="black"/><rect x="91" y="4" width="1" height="1" fill="black"/>
            <path d="M93 105H89V106H88V110H89V111H93V110H94V106H93V105Z" fill="black"/>
            <path d="M92 106H90V107H89V109H90V110H92V109H93V107H92V106Z" fill="#93FCEE"/>
            <rect x="90" y="108" width="1" height="1" fill="black"/><rect x="91" y="107" width="1" height="1" fill="black"/>
            <path d="M7 105H3V106H2V110H3V111H7V110H8V106H7V105Z" fill="black"/>
            <path d="M6 106H4V107H3V109H4V110H6V109H7V107H6V106Z" fill="#93FCEE"/>
            <rect x="4" y="108" width="1" height="1" fill="black"/><rect x="5" y="107" width="1" height="1" fill="black"/>
            {/* Output indicator */}
            {resultBlob && (
              <>
                <rect x="20" y="35" width="60" height="4" fill="#009F00"/>
                <rect x="20" y="45" width="60" height="4" fill="#009F00"/>
                <rect x="20" y="55" width="40" height="4" fill="#009F00"/>
                <text x="48" y="80" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#009F00">READY ↓</text>
              </>
            )}
          </svg>
        </button>

      </div>{/* /main-layout */}

      {/* ── HUD ── */}
      <div className="hud">
        <div className="mode-bar">
          <button
            className={`mode-btn${currentMode === 'wrappers' ? ' active' : ''}`}
            onClick={() => switchMode('wrappers')}
          >
            Generate Wrappers
          </button>
          <button
            className={`mode-btn${currentMode === 'annotate' ? ' active' : ''}`}
            onClick={() => switchMode('annotate')}
          >
            Annotate Source
          </button>
        </div>
        {statusText && <div className={statusClass}>{statusText}</div>}
      </div>

      {/* ── Hidden file input ── */}
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
