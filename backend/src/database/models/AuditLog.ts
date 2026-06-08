import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  entityType: 'Regulation' | 'Obligation' | 'MAP';
  entityId: mongoose.Types.ObjectId;
  action: string; // e.g., 'CREATED', 'UPDATED', 'VALIDATED'
  performedBy: string; // User ID or Agent ID
  previousState: any;
  newState: any;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  entityType: { type: String, enum: ['Regulation', 'Obligation', 'MAP'], required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  previousState: { type: Schema.Types.Mixed },
  newState: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
