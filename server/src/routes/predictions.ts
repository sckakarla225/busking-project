import express from 'express';
import { 
  predictSpots, 
  predictSpot 
} from '../controllers/predictions';

const router = express.Router();

/**
 * @swagger
 * /predictions/all:
 *   post:
 *     summary: Get predicions for all spots
 *     responses:
 *       200:
 *         description: Successfully retrieved all predictions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 */
router.post('/predict_all', predictSpots);
/**
 * @swagger
 * /predictions/predict:
 *   post:
 *     summary: Get a prediction for a spot
 *     responses:
 *       200:
 *         description: Successfully retrieved a prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 */
router.post('/predict', predictSpot);

export default router;