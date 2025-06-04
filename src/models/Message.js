import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  message: {
    type: String,
    required: true,
  },
});
const Message = mongoose.model('contact', messageSchema);
export default Message;
