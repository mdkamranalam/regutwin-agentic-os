import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'ComplianceOfficer' | 'DepartmentHead' | 'Auditor';
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'ComplianceOfficer', 'DepartmentHead', 'Auditor'],
    default: 'ComplianceOfficer'
  },
  department: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
