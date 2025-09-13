import mongoose, { Schema, Document } from 'mongoose';
import { Entry } from '@/types/entry';

export interface IEntry extends Omit<Entry, 'id'>, Document {}

const EntrySchema = new Schema<IEntry>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      enum: ['note', 'code', 'task'],
      required: true,
      default: 'note',
    },
    language: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
EntrySchema.index({ createdAt: -1 });
EntrySchema.index({ updatedAt: -1 });
EntrySchema.index({ type: 1 });

// Transform the output to remove _id and __v
EntrySchema.set('toJSON', {
  transform: function (doc, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Clear any existing model to ensure fresh schema
if (mongoose.models.Entry) {
  delete mongoose.models.Entry;
}

export default mongoose.model<IEntry>('Entry', EntrySchema);
