import express from 'express';
import {
  getUser, 
  createUser, 
  updatePerformanceStyles, 
  updateRecentSpots 
} from '../controllers/user';

const router = express.Router();

/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Get performer info
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
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
router.get('/user', getUser);
router.post('/create', createUser);
router.post('/update_performance_styles', updatePerformanceStyles);
router.put('/update_recent_spots', updateRecentSpots);

export default router;