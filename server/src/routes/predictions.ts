import express from 'express';
import { 
  predictSpots, 
  predictSpot 
} from '../controllers/predictions';

const router = express.Router();

router.post('/predict_all', predictSpots);
router.post('/predict', predictSpot);

export default router;