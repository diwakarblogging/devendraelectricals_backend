import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Value is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISetting>('Setting', settingSchema);
