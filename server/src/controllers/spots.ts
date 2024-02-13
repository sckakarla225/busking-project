import { Request, Response } from 'express';

const getSpots = async (req: Request, res: Response) => {
    // Logic to get a user
    res.status(200).send("Get Spots");
};

const getCurrentSpot = async (req: Request, res: Response) => {
    // Logic to create a user
    res.status(200).send("Get Current Spot");
};

const reserveSpot = async (req: Request, res: Response) => {
    // Logic to update performance styles
    res.status(200).send("Reserve Spot");
};

const leaveSpot = async (req: Request, res: Response) => {
    // Logic to update recent spots
    res.status(200).send("Leave Spot");
};

const getSpotGraphics = async (req: Request, res: Response) => {
    // Logic to update recent spots
    res.status(200).send("Get Spot Graphics");
};

export {
  getSpots,
  getCurrentSpot,
  reserveSpot,
  leaveSpot,
  getSpotGraphics
};