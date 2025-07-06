import * as messageService from '../../services/messageService.js';
import { postMessage } from '../messageController.js';
describe('messageController', () => {
  let res, req, next;
  beforeEach(() => {
    req = {
      body: { fullName: 'user', email: 'user@gmail.com', message: 'message' },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('send message and returns status 200', async () => {
    jest.spyOn(messageService, 'postMessage').mockResolvedValue();

    await postMessage(req, res, next);

    expect(messageService.postMessage).toHaveBeenCalledWith({
      fullName: 'user',
      email: 'user@gmail.com',
      message: 'message',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message:
        'Message sent successfully,we will contact you as soon as possible!',
    });
    expect(next).not.toHaveBeenCalled();
  });
  test('calls next with error if service throws', async () => {
    const error = new Error('err');
    jest.spyOn(messageService, 'postMessage').mockRejectedValue(error);

    await postMessage(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
