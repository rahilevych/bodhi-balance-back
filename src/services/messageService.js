import Message from '../models/Message.js';
import { createTransporter } from '../config/mailer.js';

export const postMessage = async ({ fullName, email, message }) => {
  const newMessage = new Message({ fullName, email, message });
  await newMessage.save();
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Bodhi Balance Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: 'New Contact Form Submission',
    text: `
      Name: ${fullName}
      Email: ${email}
      Message: ${message}
    `,
  });
};
