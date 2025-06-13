import mongoose from 'mongoose';
import { subscriptionSchema } from './Subscription';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: { type: String },
  phone: { type: String },
  subscription: {
    type: {
      subscriptionSchema,
    },
    required: false,
  },

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
