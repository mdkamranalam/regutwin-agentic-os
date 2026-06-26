import mongoose, { Schema, Document } from "mongoose";

export enum MapStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  CLOSED = "CLOSED",
  OVERDUE = "OVERDUE",
}

export enum MapDepartment {
  IT_SECURITY = "IT Security",
  RISK = "Risk",
  LEGAL = "Legal",
  COMPLIANCE = "Compliance",
  FINANCE = "Finance",
}

export enum MapPriority {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export enum ValidationMethod {
  API_TEST = "API_TEST",
  EVIDENCE_REVIEW = "EVIDENCE_REVIEW",
  POLICY_CHECK = "POLICY_CHECK",
  CONFIGURATION_CHECK = "CONFIGURATION_CHECK",
  MANUAL_REVIEW = "MANUAL_REVIEW",
}

export interface IMap extends Document {
  regulationId: mongoose.Types.ObjectId;
  description: string;
  assignedTo: string;
  actionRequired: string;
  status: MapStatus;
  priority: string;
  riskLevel: string;
  deadline?: Date;
  slaBreachCount: number;
  // Measurable MAP fields
  acceptanceCriteria: string;
  validationMethod: string;
  successThreshold: string;
  evidenceRequired: string;
  // Autonomous validation config
  targetApiEndpoint?: string;
  testConfig?: {
    method: string;
    payload?: string;
    expectedStatus?: number;
    expectedResponseSubstring?: string;
  };
  // Validation result
  lastValidationResult?: {
    is_valid: boolean;
    confidence: number;
    feedback: string;
    validated_at: Date;
  };
}

const MapSchema = new Schema<IMap>(
  {
    regulationId: {
      type: Schema.Types.ObjectId,
      ref: "Regulation",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      enum: Object.values(MapDepartment),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MapStatus),
      default: MapStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(MapPriority),
      default: MapPriority.MEDIUM,
    },
    riskLevel: {
      type: String,
      enum: Object.values(MapPriority),
      default: MapPriority.MEDIUM,
    },
    deadline: {
      type: Date,
    },
    slaBreachCount: {
      type: Number,
      default: 0,
    },
    actionRequired: {
      type: String,
      required: true,
    },
    // Measurable MAP fields
    acceptanceCriteria: {
      type: String,
      default: "Task must be completed and evidence submitted for review.",
    },
    validationMethod: {
      type: String,
      enum: Object.values(ValidationMethod),
      default: ValidationMethod.EVIDENCE_REVIEW,
    },
    successThreshold: {
      type: String,
      default: "100% completion required",
    },
    evidenceRequired: {
      type: String,
      default: "Documented evidence of implementation must be submitted.",
    },
    // Autonomous validation
    targetApiEndpoint: String,
    testConfig: {
      method: String,
      payload: String,
      expectedStatus: Number,
      expectedResponseSubstring: String,
    },
    lastValidationResult: {
      is_valid: Boolean,
      confidence: Number,
      feedback: String,
      validated_at: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMap>("MAP", MapSchema);
