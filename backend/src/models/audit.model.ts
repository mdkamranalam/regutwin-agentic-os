import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface IAudit extends Document {
  mapId: mongoose.Types.ObjectId;
  regulationId: mongoose.Types.ObjectId;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  evidenceText?: string;
  evidenceHash?: string;
  evidenceFilePath?: string;
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
    evidenceHash: String,
    evidenceFilePath: String,
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

// Cryptographic hash generation on creation if evidenceText is provided
AuditSchema.pre("save", async function () {
  if (!this.isNew) {
    throw new Error("🚨 Cryptographic Evidence Vault: Audit logs are strictly WORM (Write Once Read Many) and immutable.");
  }
  if (this.evidenceText && !this.evidenceHash) {
    this.evidenceHash = crypto.createHash("sha256").update(this.evidenceText).digest("hex");
  }
});

AuditSchema.pre("findOneAndUpdate", function () {
  throw new Error("🚨 Tamper Detection: Audit Trail records cannot be modified.");
});

AuditSchema.pre("findOneAndDelete", function () {
  throw new Error("🚨 Tamper Detection: Audit Trail records cannot be deleted.");
});

export default mongoose.model<IAudit>("Audit", AuditSchema);
