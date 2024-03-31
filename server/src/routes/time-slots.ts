import express from 'express';
import {
  getTimeSlots,
  createTimeSlots,
  reserveTimeSlot,
  freeTimeSlot
} from '../controllers/time-slots';

const router = express.Router();

router.get('/all', getTimeSlots);
router.post('/create', createTimeSlots);
router.post('/reserve', reserveTimeSlot);
router.put('/free', freeTimeSlot);

export default router;