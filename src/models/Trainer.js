import mongoose from 'mongoose';
const trainerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  specialization: { type: String, required: true },
  about: { type: String, required: true },
  photo: { type: String, required: true },
});
const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
