import * as messageService from '../services/messageService.js';

export const postMessage = async (req, res, next) => {
  try {
    const { fullName, email, message } = req.body;
    await messageService.postMessage({ fullName, email, message });
    res
      .status(200)
      .json({
        success: true,
        message:
          'Message sent successfully,we will contact you as soon as possible!',
      });
  } catch (error) {
    next(error);
  }
};
