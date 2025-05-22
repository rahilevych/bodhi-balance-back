import YogaStyle from '../models/YogaStyle.js';

export const getAllStyles = async () => {
  const styles = await YogaStyle.find({});
  return styles;
};
