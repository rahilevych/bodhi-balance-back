import mongoose from 'mongoose';
const styleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
  trainer: { type: String, required: true },
});
const YogaStyle = mongoose.model('Style', styleSchema);
export default YogaStyle;
