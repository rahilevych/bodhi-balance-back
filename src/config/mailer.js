import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};
