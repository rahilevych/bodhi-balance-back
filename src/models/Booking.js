import mongoose from 'mongoose';
const bookingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  status: { type: string, enum: 'booked' | 'attended' | 'cancelled' },
});
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
