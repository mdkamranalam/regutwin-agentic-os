import mongoose, { Schema, Document } from 'mongoose';

export interface IObligation extends Document {
  regulationId: mongoose.Types.ObjectId;
  text: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: Date;
  affectedDepartments: string[];
  affectedSystems: string[];
  status: 'pending' | 'implemented' | 'validated';
  createdAt: Date;
  updatedAt: Date;
}

const ObligationSchema: Schema = new Schema({
  regulationId: { type: Schema.Types.ObjectId, ref: 'Regulation', required: true },
  text: { type: String, required: true },
  summary: { type: String },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  deadline: { type: Date },
  affectedDepartments: [{ type: String }],
  affectedSystems: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'implemented', 'validated'],
    default: 'pending'
  },
}, { timestamps: true });

export default mongoose.model<IObligation>('Obligation', ObligationSchema);
