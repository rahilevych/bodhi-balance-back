import express from 'express';

const cronRouter = express.Router();
cronRouter.post('/schedule', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.sendStatus(401);
  }
  try {
    await generateDaileSchedule();
    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(500).send('err');
  }
});
export default cronRouter;
