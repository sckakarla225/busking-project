import { Request, Response } from 'express';

const getUser = async (req: Request, res: Response) => {
    // Logic to get a user
    res.status(200).send("Get User");
};

const createUser = async (req: Request, res: Response) => {
    // Logic to create a user
    res.status(201).send("Create User");
};

const updatePerformanceStyles = async (req: Request, res: Response) => {
    // Logic to update performance styles
    res.status(200).send("Update Performance Styles");
};

const updateRecentSpots = async (req: Request, res: Response) => {
    // Logic to update recent spots
    res.status(200).send("Update Recent Spots");
};

export {
  getUser,
  createUser,
  updatePerformanceStyles,
  updateRecentSpots 
};