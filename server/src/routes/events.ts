import express from 'express';
import { 
  getEvents, 
  getNearbyEvents,
  createEvents 
} from '../controllers/events';

const router = express.Router();

router.get('/all', getEvents);
router.post('/nearby', getNearbyEvents);
router.post('/create', createEvents);

export default router;