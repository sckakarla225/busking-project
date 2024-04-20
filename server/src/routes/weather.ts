import express from 'express';
import { getWeatherForDateAndHour } from '../controllers/weather';

const router = express.Router();

router.post('/info', getWeatherForDateAndHour);

export default router;