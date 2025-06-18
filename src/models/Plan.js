import mongoose from 'mongoose';
const planSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pack', 'unlimited'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  durationInMonths: {
    type: Number,
    required: function () {
      return this.type === 'unlimited';
    },
  },
  trainingsCount: {
    type: Number,
    required: function () {
      return this.type === 'pack';
    },
  },
});
const Plan = mongoose.model('Plan', planSchema);
export default Plan;
