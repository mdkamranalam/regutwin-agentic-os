/* ============================================
   Upload / Document Types
   ============================================ */

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    fileId: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  };
}
