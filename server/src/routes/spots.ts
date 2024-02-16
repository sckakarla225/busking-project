import express from 'express';
import { 
  getSpots, 
  getCurrentSpot, 
  reserveSpot, 
  leaveSpot, 
  getSpotGraphics 
} from '../controllers/spots';

const router = express.Router();

/**
 * @swagger
 * /spots/all:
 *   get:
 *     summary: Get all spots
 *     responses:
 *       200:
 *         description: Successfully retrieved spots
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
router.get('/all', getSpots);
/**
 * @swagger
 * /spots/current:
 *   get:
 *     summary: Get user's current spot
 *     responses:
 *       200:
 *         description: Successfully retrieved user's current spot
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
router.get('/current/:id', getCurrentSpot);
/**
 * @swagger
 * /spots/reserve:
 *   put:
 *     summary: Reserve a spot
 *     responses:
 *       200:
 *         description: Successfully reserved a spot
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
router.post('/reserve', reserveSpot);
/**
 * @swagger
 * /spots/leave:
 *   put:
 *     summary: Leave a spot
 *     responses:
 *       200:
 *         description: Successfully left a spot
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
router.put('/leave', leaveSpot);
/**
 * @swagger
 * /spots/graphics:
 *   get:
 *     summary: Get spot's graphics
 *     responses:
 *       200:
 *         description: Successfully retrieved spot graphics
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
router.get('/graphics', getSpotGraphics);

export default router;