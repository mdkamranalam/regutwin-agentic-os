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

export interface IMap extends Document {
  regulationId: mongoose.Types.ObjectId;
  description: string;
  assignedTo: string;
  actionRequired: string;
  status: MapStatus;
  deadline?: Date;
  slaBreachCount: number;
  targetApiEndpoint?: string;
  testConfig?: {
    method: string;
    payload?: string;
    expectedStatus?: number;
    expectedResponseSubstring?: string;
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
    targetApiEndpoint: String,
    testConfig: {
      method: String,
      payload: String,
      expectedStatus: Number,
      expectedResponseSubstring: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMap>("MAP", MapSchema);
