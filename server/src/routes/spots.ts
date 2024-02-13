import express from 'express';
import { 
  getSpots, 
  getCurrentSpot, 
  reserveSpot, 
  leaveSpot, 
  getSpotGraphics 
} from '../controllers/spots';

const router = express.Router();

router.get('/spots_all', getSpots);
router.get('/current_spot', getCurrentSpot);
router.post('/reserve', reserveSpot);
router.put('/leave', leaveSpot);
router.get('/graphics', getSpotGraphics);

export default router;