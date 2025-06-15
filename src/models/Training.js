import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    required: true,
  },

  spots_taken: {
    type: Number,
    required: true,
    default: 0,
  },
  spots_total: {
    type: Number,
    required: true,
  },
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  yogaStyle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Style',
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
});

const Training = mongoose.model('Training', trainingSchema);
export default Training;
