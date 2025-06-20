import Training from '../models/Training.js';
import ScheduleTemplate from '../models/ScheduleTemplate.js';

export const generateWeeklySchedule = async () => {
  try {
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const weekday = currentDate.getDay();
      const templates = await ScheduleTemplate.find({ weekday });

      const dateStart = new Date(currentDate.setHours(0, 0, 0, 0));
      const dateEnd = new Date(currentDate.setHours(23, 59, 59, 999));

      const existingSchedules = await Training.find({
        datetime: { $gte: dateStart, $lte: dateEnd },
      });

      if (existingSchedules.length > 0) {
        continue;
      }

      for (const template of templates) {
        const [hours, minutes] = template.time.split(':').map(Number);
        const datetime = new Date(dateStart);
        datetime.setHours(hours, minutes, 0, 0);
        await Training.create({
          datetime,
          spots_total: template.spots_total,
          trainer_id: template.trainer_id,
          yogaStyle_id: template.yogaStyle_id,
          price: template.price,
          priceId: template.priceId,
          duration: template.duration,
        });
      }
    }
  } catch (error) {
    console.error('Error generating schedule:', error);
  }
};
