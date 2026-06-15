import mongoose, { Schema, Document } from "mongoose";

export enum RegulationStatus {
  NEW = "NEW",
  ANALYZED = "ANALYZED",
  MAPPED = "MAPPED",
  VALIDATED = "VALIDATED",
}

export interface IRegulation extends Document {
  title: string;
  source: string;
  filePath: string;
  extractedText: string;
  publishedDate?: Date;
  status: RegulationStatus;
}

const RegulationSchema = new Schema<IRegulation>(
  {
    title: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    publishedDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: Object.values(RegulationStatus),
      default: RegulationStatus.NEW,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRegulation>("Regulation", RegulationSchema);
