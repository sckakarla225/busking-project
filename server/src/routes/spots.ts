import express from 'express';
import { 
  getSpots, 
  createSpots,
  getCurrentSpot, 
  reserveSpot, 
  leaveSpot, 
  getSpotGraphics 
} from '../controllers/spots';

const router = express.Router();

router.get('/all', getSpots);
router.post('/create', createSpots);
router.get('/current/:userId', getCurrentSpot);
router.post('/reserve', reserveSpot);
router.put('/leave', leaveSpot);
router.get('/graphics', getSpotGraphics);

export default router;