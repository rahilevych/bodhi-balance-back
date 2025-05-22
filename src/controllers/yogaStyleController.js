import * as yogaStyleService from '../services/yogaStyleService.js';

export const getAllStyles = async (req, res, next) => {
  try {
    const styles = await yogaStyleService.getAllStyles();
    console.log(styles);
    res.status(200).json(styles);
  } catch (error) {
    next(error);
  }
};
