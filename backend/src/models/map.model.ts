import mongoose, { Schema, Document } from "mongoose";

export enum MapStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  CLOSED = "CLOSED",
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
  status: MapStatus;
  deadline?: Date;
  actionRequired: string;
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
    actionRequired: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMap>("MAP", MapSchema);
