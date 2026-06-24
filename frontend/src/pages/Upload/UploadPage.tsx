import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UploadedFile, UploadStatus } from '../../types/upload';

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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadFile = useCallback(async (fileObj: UploadedFile) => {
    setFiles((prev) => prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'uploading' as UploadStatus, progress: 5 } : f)));
    try {
      const formData = new FormData();
      formData.append('pdf', fileObj.file);
      formData.append('title', fileObj.file.name.replace(/\.[^/.]+$/, ''));
      formData.append('source', 'Manual Upload');

      const { default: api } = await import('../../services/api');
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

  const hasSuccess = files.some(f => f.status === 'success');

  return (
    <div className="fade-in max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Upload Regulatory Document</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Upload a PDF or document to trigger autonomous AI analysis, MAP extraction, and conflict detection.
        </p>
      </div>

      {/* Supported formats */}
      <div className="flex items-center gap-2 flex-wrap">
        {['PDF', 'DOCX', 'TXT', 'CSV'].map(fmt => (
          <span
            key={fmt}
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            {fmt}
          </span>
        ))}
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>• Max 500 MB</span>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-2xl transition-all duration-200 cursor-pointer glass-card-hover ${isDragOver ? 'scale-[1.01] !border-indigo-500 !bg-indigo-500/10' : ''}`}
        style={{
          borderStyle: 'dashed',
          borderWidth: '2px',
          padding: '48px 32px',
          textAlign: 'center',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="upload-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileSelect}
          className="hidden"
          id="upload-file-input"
        />
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#818cf8" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base">Drop your file here</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>or click to browse</p>
          </div>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* AI pipeline hint */}
      <div className="flex items-start gap-3 p-4 rounded-xl glass-panel border border-emerald-500/20 bg-emerald-500/5">
        <span className="text-lg mt-0.5">🤖</span>
        <div>
          <p className="text-sm font-semibold text-white">Autonomous AI Pipeline</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Once uploaded, the Watchman Agent detects the document, the Analyst extracts obligations,
            the Conflict Engine checks for contradictions, and MAPs are auto-generated for each department.
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Uploads ({files.length})
          </p>
          {files.map((file) => {
            const ext = file.name.split('.').pop() || '';
            return (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 rounded-xl glass-panel"
              >
                <FileIcon ext={ext} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  {file.status === 'uploading' ? (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <span>Uploading & analyzing...</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                        />
                      </div>
                    </div>
                  ) : file.status === 'success' ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-xs font-medium" style={{ color: '#10b981' }}>Analysed & MAPs generated</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>· {formatFileSize(file.size)}</span>
                    </div>
                  ) : (
                    <p className="text-xs mt-1" style={{ color: '#ef4444' }}>✕ {file.error}</p>
                  )}
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigate to MAPs after success */}
      {hasSuccess && (
        <button
          onClick={() => navigate('/maps')}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
        >
          View Generated MAPs →
        </button>
      )}
    </div>
  );
}
