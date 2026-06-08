import mongoose, { Schema, Document } from 'mongoose';

export interface IMAP extends Document {
  obligationId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  measurableCriteria: string; // The "Proof" required
  assignedDepartment: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'in_progress' | 'completed' | 'validated' | 'failed';
  evidenceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MAPSchema: Schema = new Schema({
  obligationId: { type: Schema.Types.ObjectId, ref: 'Obligation', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  measurableCriteria: { type: String, required: true },
  assignedDepartment: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'validated', 'failed'],
    default: 'pending'
  },
  evidenceUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IMAP>('MAP', MAPSchema);
