import mongoose, { Schema, Document } from "mongoose";

export interface IAudit extends Document {
  mapId: mongoose.Types.ObjectId;
  regulationId: mongoose.Types.ObjectId;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  evidenceText?: string;
  validationResult?: {
    is_valid: boolean;
    confidence: number;
    feedback: string;
  };
  createdAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    mapId: {
      type: Schema.Types.ObjectId,
      ref: "MAP",
      required: true,
    },
    regulationId: {
      type: Schema.Types.ObjectId,
      ref: "Regulation",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    previousStatus: String,
    newStatus: String,
    evidenceText: String,
    validationResult: {
      is_valid: Boolean,
      confidence: Number,
      feedback: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAudit>("Audit", AuditSchema);
