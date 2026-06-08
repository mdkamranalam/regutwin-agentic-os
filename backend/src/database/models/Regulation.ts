import mongoose, { Schema, Document } from 'mongoose';

export interface IRegulation extends Document {
  title: string;
  source: string; // e.g., RBI, SEBI
  documentUrl: string;
  content: string;
  publishedDate: Date;
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const RegulationSchema: Schema = new Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  documentUrl: { type: String, required: true },
  content: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  analysisStatus: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: { type: Map, of: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model<IRegulation>('Regulation', RegulationSchema);
