import mongoose from 'mongoose';

const scheduleTemplateSchema = new mongoose.Schema({
  weekday: { type: Number, required: true },
  time: { type: String, required: true },
  spots_total: { type: Number, required: true },
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  yogaStyle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Style',
    required: true,
  },
});

const ScheduleTemplate = mongoose.model(
  'ScheduleTemplate',
  scheduleTemplateSchema
);
export default ScheduleTemplate;
