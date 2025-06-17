import mongoose from 'mongoose';
const bookingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'] },
});
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
