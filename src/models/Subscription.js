import mongoose from 'mongoose';

export const subscriptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['unlimited', 'pack', 'one'],
      required: true,
    },
    remainingTrainings: { type: Number },
    validUntil: { type: Date },
  },
  { _id: false }
);
