import { createTransporter } from '../../config/mailer';
import Message from '../../models/Message';
import { postMessage } from '../messageService';

jest.mock('../../models/Message.js');
jest.mock('../../config/mailer.js');

describe('messageService', () => {
  const mockSendMail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    createTransporter.mockReturnValue({
      sendMail: mockSendMail,
    });

    Message.mockImplementation(function (data) {
      this.fullName = data.fullName;
      this.email = data.email;
      this.message = data.message;
      this.save = jest.fn().mockResolvedValue();
    });
  });
  test('saves message and send email', async () => {
    const input = {
      fullName: 'User',
      email: 'user@example.com',
      message: 'Hello!',
    };

    await postMessage(input);

    expect(Message).toHaveBeenCalledWith(input);

    const messageInstance = Message.mock.instances[0];
    expect(messageInstance.save).toHaveBeenCalled();

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining(process.env.EMAIL_USER),
        to: process.env.EMAIL_TO,
        replyTo: input.email,
        subject: 'New Contact Form Submission',
        text: expect.stringContaining(input.message),
      })
    );
  });
});
