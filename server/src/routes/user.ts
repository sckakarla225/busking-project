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
router.get('/user/:id', getUser);
/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create new performer
 *     responses:
 *       200:
 *         description: Successfully created user
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
router.post('/create', createUser);
/**
 * @swagger
 * /users/update_performance_styles:
 *   post:
 *     summary: Update user's performance styles
 *     responses:
 *       200:
 *         description: Successfully updated performance styles
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
router.post('/update_performance_styles', updatePerformanceStyles);
/**
 * @swagger
 * /users/update_recent_spots:
 *   put:
 *     summary: Update user's recent spots
 *     responses:
 *       200:
 *         description: Successfully updated user's recent spots
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
router.put('/update_recent_spots', updateRecentSpots);

export default router;