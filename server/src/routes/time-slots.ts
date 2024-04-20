import express from 'express';
import {
  getTimeSlots,
  createTimeSlots,
  reserveTimeSlot,
  freeTimeSlot,
  generateTimeSlots,
  filterIdealTimeSlots,
  getIdealTimeSlots
} from '../controllers/time-slots';

const router = express.Router();

router.get('/all', getTimeSlots);
router.post('/create', createTimeSlots);
router.post('/reserve', reserveTimeSlot);
router.put('/free', freeTimeSlot);
router.post('/generate', generateTimeSlots);
router.put('/filter', filterIdealTimeSlots);
router.get('/ideal', getIdealTimeSlots);

export default router;