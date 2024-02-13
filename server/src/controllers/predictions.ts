import { Request, Response } from 'express';

const predictSpots = async (req: Request, res: Response) => {
    // Logic to get a user
    res.status(200).send("Predict Spots");
};

const predictSpot = async (req: Request, res: Response) => {
    // Logic to create a user
    res.status(200).send("Predict Spot");
};

export {
  predictSpots,
  predictSpot
};