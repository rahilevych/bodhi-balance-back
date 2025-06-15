import mongoose from 'mongoose';
const planSchema = new mongoose.Schema({
  type: {
    type: String,
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
});
const Plan = mongoose.model('plan', planSchema);
export default Plan;
