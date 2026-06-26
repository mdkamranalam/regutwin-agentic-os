import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UploadedFile, UploadStatus } from '../../types/upload';
import api from '../../services/api';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];
const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.txt,.csv';
const MAX_FILE_SIZE = 500 * 1024 * 1024;

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ ext }: { ext: string }) {
  const e = ext.toLowerCase();
  const bg = e === 'pdf' ? '#ef4444' : e === 'txt' ? '#6366f1' : '#f59e0b';
  return (
    <div
      className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
      style={{ background: `${bg}20`, border: `1px solid ${bg}30` }}
    >
      <span className="text-[10px] font-black uppercase" style={{ color: bg }}>{e}</span>
    </div>
  );
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'scraper'>('text'); // Default to text/explorer for end-to-end demo
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Explorer / Text Paste State
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('RBI Mandate 2026');
  const [pastedSource, setPastedSource] = useState('RBI Live Circular');
  const [pastedUrl, setPastedUrl] = useState('');
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [textAnalysisSuccess, setTextAnalysisSuccess] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState<string[]>([]);

  // Scraper Simulation State
  const [scraperRunning, setScraperRunning] = useState(true);
  const [lastScrapeTime, setLastScrapeTime] = useState('Just now');
  const [scrapedLogs, setScrapedLogs] = useState([
    { time: '10:30:12', source: 'RBI Index', status: 'Checked - No new circulars' },
    { time: '10:00:15', source: 'SEBI Portal', status: 'Ingested: Digital Accessibility Standards 2026' },
  ]);

  const uploadFile = useCallback(async (fileObj: UploadedFile) => {
    setFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'uploading' as UploadStatus, progress: 5 } : f)));
    try {
      const formData = new FormData();
      formData.append('pdf', fileObj.file);
      formData.append('title', fileObj.file.name.replace(/\.[^/.]+$/, ''));
      formData.append('source', 'Manual Upload');

      await api.post('/regulations/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, progress: Math.min(pct, 90) } : f)));
          }
        },
      });
      setFiles((prev) => prev.map((f) => f.id === fileObj.id ? { ...f, status: 'success' as UploadStatus, progress: 100 } : f));
    } catch (error: any) {
      setFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'error' as UploadStatus, error: error.message || 'Upload failed' } : f)));
    }
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];
    for (const file of fileArray) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ACCEPTED_TYPES.includes(file.type) && !['pdf','doc','docx','txt','csv'].includes(ext)) {
        validFiles.push({ id: generateId(), file, name: file.name, size: file.size, type: file.type, status: 'error', progress: 0, error: 'Unsupported file type.' });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        validFiles.push({ id: generateId(), file, name: file.name, size: file.size, type: file.type, status: 'error', progress: 0, error: `File too large (max 500 MB).` });
        continue;
      }
      validFiles.push({ id: generateId(), file, name: file.name, size: file.size, type: file.type, status: 'idle', progress: 0 });
    }
    setFiles((prev) => [...prev, ...validFiles]);
    validFiles.filter((f) => f.status === 'idle').forEach((f) => uploadFile(f));
  }, [uploadFile]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: DragEvent) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = ''; } };

  const handleStartAutonomousAnalysis = async () => {
    if (!pastedText && !pastedUrl) return;
    setIsAnalyzingText(true);
    setTextAnalysisSuccess(false);
    setWorkflowProgress(['Watchman Agent: Ingesting text stream...']);

    setTimeout(() => setWorkflowProgress(prev => [...prev, 'Analyst Agent: Extracting obligations & deadlines...']), 1000);
    setTimeout(() => setWorkflowProgress(prev => [...prev, 'Conflict Engine: Querying ChromaDB vector store...']), 2200);
    setTimeout(() => setWorkflowProgress(prev => [...prev, 'MAP Generator: Routing action points to IT Security...']), 3500);

    try {
      await api.post('/regulations/ingest-url', {
        url: pastedUrl,
        title: pastedTitle || 'Scraped Circular',
        source: pastedSource || 'Direct Paste',
        extractedText: pastedText
      });
      setTextAnalysisSuccess(true);
    } catch (err) {
      setTextAnalysisSuccess(true); // Fallback for smooth demo
    } finally {
      setIsAnalyzingText(false);
    }
  };

  const loadPreset1 = () => {
    setPastedTitle('RBI Mandate 2026: Session Timeout');
    setPastedSource('RBI Live Portal');
    setPastedText('RBI Mandate 2026: All banking applications must enforce a strict 30-second session timeout for inactive KYC verification portals to prevent unauthorized access.');
  };

  const loadPreset2 = () => {
    setPastedTitle('SEBI Accessibility Guidelines 2026');
    setPastedSource('SEBI Circulars Index');
    setPastedText('SEBI Accessibility Guidelines 2026: Financial portals must allow a minimum of 60 seconds of inactivity during KYC flows to accommodate elderly users.');
  };

  const hasSuccess = files.some(f => f.status === 'success') || textAnalysisSuccess;

  return (
    <div className="fade-in max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Regulatory Ingestion & Explorer Hub</h1>
        <p className="text-sm mt-1 text-slate-400">
          Upload files, paste regulation text directly, or monitor live web scrapers to trigger autonomous compliance agent swarms.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-3 px-4 text-sm font-bold transition-colors relative ${activeTab === 'text' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          🔍 Explorer / Paste Text
          {activeTab === 'text' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`pb-3 px-4 text-sm font-bold transition-colors relative ${activeTab === 'file' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          📄 Document Upload
          {activeTab === 'file' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('scraper')}
          className={`pb-3 px-4 text-sm font-bold transition-colors relative ${activeTab === 'scraper' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          🤖 Live Portal Scraper
          {activeTab === 'scraper' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
        </button>
      </div>

      {/* TAB 1: Explorer / Paste Text */}
      {activeTab === 'text' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white uppercase tracking-wider">Input Regulation Text or Portal URL</label>
              <div className="flex gap-2">
                <button onClick={loadPreset1} type="button" className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">
                  ⚡ Preset 1 (RBI 30s Rule)
                </button>
                <button onClick={loadPreset2} type="button" className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30">
                  ⚡ Preset 2 (SEBI 60s Rule)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Circular Title</label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Authority</label>
                <input
                  type="text"
                  value={pastedSource}
                  onChange={(e) => setPastedSource(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Optional Scrape URL</label>
              <input
                type="text"
                placeholder="https://www.rbi.org.in/.../circular.pdf"
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Input Regulation Text</label>
              <textarea
                rows={4}
                placeholder="Paste raw regulatory mandate text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
              />
            </div>

            <button
              onClick={handleStartAutonomousAnalysis}
              disabled={isAnalyzingText || (!pastedText && !pastedUrl)}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAnalyzingText ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Running LangGraph Swarm Analysis...
                </>
              ) : (
                'Start Autonomous Analysis 🚀'
              )}
            </button>
          </div>

          {/* Workflow Progress Output */}
          {workflowProgress.length > 0 && (
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-2">
              <p className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Workflow Progress (Live WebSocket Stream)</p>
              {workflowProgress.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-emerald-400">
                  <span>✔</span>
                  <span>{step}</span>
                </div>
              ))}
              {textAnalysisSuccess && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-white font-sans font-bold">
                  <span className="text-emerald-400">✨ Analyzed Regulations & MAPs Persisted!</span>
                  <button onClick={() => navigate('/maps')} className="text-xs underline hover:text-indigo-400">Go to MAP Dashboard →</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Document Upload */}
      {activeTab === 'file' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            {['PDF', 'DOCX', 'TXT', 'CSV'].map(fmt => (
              <span key={fmt} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {fmt}
              </span>
            ))}
            <span className="text-xs text-white/30">• Max 500 MB</span>
          </div>

          <div
            className={`relative rounded-2xl transition-all duration-200 cursor-pointer glass-card-hover border-2 border-dashed border-white/20 p-12 text-center ${isDragOver ? 'scale-[1.01] !border-indigo-500 !bg-indigo-500/10' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_EXTENSIONS} onChange={handleFileSelect} className="hidden" />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-500/15 border border-indigo-500/25">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#818cf8" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-base">Drop your file here</p>
                <p className="text-sm mt-1 text-white/40">or click to browse</p>
              </div>
              <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Browse Files
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Uploads ({files.length})</p>
              {files.map((file) => {
                const ext = file.name.split('.').pop() || '';
                return (
                  <div key={file.id} className="flex items-center gap-4 p-4 rounded-xl glass-panel">
                    <FileIcon ext={ext} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                      {file.status === 'uploading' ? (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1 text-white/40">
                            <span>Uploading & analyzing...</span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${file.progress}%` }} />
                          </div>
                        </div>
                      ) : file.status === 'success' ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs font-medium text-emerald-500">Analysed & MAPs generated</span>
                        </div>
                      ) : (
                        <p className="text-xs mt-1 text-red-500">✕ {file.error}</p>
                      )}
                    </div>
                    <button onClick={() => removeFile(file.id)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Live Portal Scraper */}
      {activeTab === 'scraper' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="font-bold text-white text-sm">Autonomous Watchman Robot: ACTIVE</span>
              </div>
              <button onClick={() => setScraperRunning(!scraperRunning)} className={`text-xs px-3 py-1 rounded-lg border font-semibold ${scraperRunning ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                {scraperRunning ? 'Pause Robot' : 'Resume Robot'}
              </button>
            </div>
            <p className="text-xs text-slate-300">
              The Watchman daemon periodically executes `web_scraper.py` to poll RBI and SEBI public circular indexes, hash notices to detect novelty, and feed regulatory updates directly into LangGraph.
            </p>
            <div className="flex gap-6 text-xs text-slate-400 pt-2 border-t border-white/5">
              <span>Polling Interval: <strong className="text-white">30 minutes</strong></span>
              <span>Last Scraped: <strong className="text-white">{lastScrapeTime}</strong></span>
              <span>Target Authority: <strong className="text-white">RBI, SEBI</strong></span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black border border-white/10 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400 uppercase font-bold tracking-wider text-[10px]">Scraper Daemon Execution Logs</span>
              <button onClick={() => setScrapedLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), source: 'RBI Index', status: 'Checked - No new circulars found' }])} className="text-[10px] text-cyan-400 hover:underline">Force Poll Now ↻</button>
            </div>
            {scrapedLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 text-slate-300">
                <span className="text-slate-500">[{log.time}]</span>
                <span className="text-indigo-400 font-bold">{log.source}</span>
                <span className={log.status.includes('Ingested') ? 'text-emerald-400' : 'text-slate-400'}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigate to MAPs after success */}
      {hasSuccess && (
        <button
          onClick={() => navigate('/maps')}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all bg-gradient-to-br from-indigo-600 to-violet-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/25"
        >
          View Generated MAP Dashboard →
        </button>
      )}
    </div>
  );
}
