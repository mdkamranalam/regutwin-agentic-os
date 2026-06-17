import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import type { UploadedFile, UploadStatus } from '../../types/upload';

/* ============================================
   UploadPage — Clean premium card design
   Matches reference: header icon block, dashed zone,
   progress bars, completed and uploading rows.
   ============================================ */

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.txt,.csv';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // Updated to 500MB to match mockup

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Initial mockup files to match reference exactly on load
const INITIAL_FILES: UploadedFile[] = [
  {
    id: 'file_mock_1',
    name: 'Certificate.pdf',
    size: 20 * 1024 * 1024,
    type: 'application/pdf',
    status: 'success',
    progress: 100,
    file: new File([], 'Certificate.pdf'),
  },
  {
    id: 'file_mock_2',
    name: 'CV-new.pdf',
    size: 120 * 1024,
    type: 'application/pdf',
    status: 'uploading',
    progress: 75,
    file: new File([], 'CV-new.pdf'),
  }
];

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (fileObj: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'uploading' as UploadStatus, progress: 10 } : f))
    );

    try {
      const formData = new FormData();
      formData.append('pdf', fileObj.file);
      formData.append('title', fileObj.file.name);
      formData.append('source', 'Manual Upload');

      // Import api dynamically or add to top
      const { default: api } = await import('../../services/api');

      await api.post('/regulations/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Note: Add auth token here if authentication is enabled
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Cap at 90% while AI analysis runs
            setFiles((prev) =>
              prev.map((f) => (f.id === fileObj.id ? { ...f, progress: Math.min(percentCompleted, 90) } : f))
            );
          }
        },
      });

      // Upload and analysis complete
      setFiles((prev) =>
        prev.map((f) => f.id === fileObj.id ? { ...f, status: 'success' as UploadStatus, progress: 100 } : f)
      );

      // Optionally, redirect to the regulation details page:
      // window.location.href = `/regulations/${response.data._id}`;

    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'error' as UploadStatus, error: error.message || 'Upload failed' } : f))
      );
    }
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        validFiles.push({
          id: generateId(), file, name: file.name, size: file.size, type: file.type,
          status: 'error', progress: 0, error: 'Unsupported file type.',
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        validFiles.push({
          id: generateId(), file, name: file.name, size: file.size, type: file.type,
          status: 'error', progress: 0, error: `File too large (max ${formatFileSize(MAX_FILE_SIZE)}).`,
        });
        continue;
      }
      validFiles.push({
        id: generateId(), file, name: file.name, size: file.size, type: file.type,
        status: 'idle', progress: 0,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
    validFiles.filter((f) => f.status === 'idle').forEach((f) => uploadFile(f));
  }, [uploadFile]);

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="page-center-wrapper">
      <div className="upload-page-card fade-in">
        {/* Header (with purple upload icon block) */}
        <div className="upload-header">
          <div className="upload-header-left">
            <div className="upload-icon-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <h1 className="upload-header-title">Upload files</h1>
              <p className="upload-header-subtitle">Select and upload the files of your choice</p>
            </div>
          </div>

          <button className="upload-close-btn" aria-label="Close upload window" onClick={() => window.location.href = '/'}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Card Body */}
        <div className="upload-body">
          {/* Dashed Drag Zone */}
          <div
            className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
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

            {/* Clickable Upload button */}
            <button type="button" className="upload-dropzone-btn" onClick={(e) => e.stopPropagation()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>

            <p className="upload-dropzone-text">
              Choose a file or drag & drop it here
            </p>
            <p className="upload-dropzone-subtext">
              Maximum 500 MB file size
            </p>
          </div>

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div className="uploaded-files-list">
              {files.map((file) => (
                <div key={file.id} className="file-row-card">
                  {/* Styled PDF Icon */}
                  <div className="file-pdf-icon-box">
                    PDF
                  </div>

                  {/* Info */}
                  <div className="file-info-col">
                    <p className="file-name-title truncate">
                      {file.name}
                    </p>

                    {file.status === 'uploading' ? (
                      <div className="flex flex-col w-full">
                        <div className="file-meta-status">
                          <span>{formatFileSize(Math.round(file.size * file.progress / 100))} / {formatFileSize(file.size)}</span>
                          <span className="status-dot-divider">•</span>
                          <span className="status-text-uploading">
                            <svg className="animate-spin-custom mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Uploading...
                          </span>
                        </div>
                        {/* Gradient Progress Bar */}
                        <div className="progress-row-wrapper">
                          <div className="gradient-progress-bar">
                            <div className="gradient-progress-fill" style={{ width: `${file.progress}%` }} />
                          </div>
                          <span className="progress-pct-lbl">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                      </div>
                    ) : file.status === 'success' ? (
                      <div className="file-meta-status">
                        <span>{formatFileSize(file.size)} / {formatFileSize(file.size)}</span>
                        <span className="status-dot-divider">•</span>
                        <span className="status-text-completed">
                          <svg className="mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Completed
                        </span>
                      </div>
                    ) : (
                      <div className="file-meta-status">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="status-dot-divider">•</span>
                        <span className="text-red-500 font-medium">✕ {file.error}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="file-action-btn"
                    aria-label={file.status === 'success' ? 'Delete file' : 'Cancel upload'}
                  >
                    {file.status === 'success' ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
