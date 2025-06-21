import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  remainingTrainings: { type: Number },
  validUntil: { type: Date },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
});
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
