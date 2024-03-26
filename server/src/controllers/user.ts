import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { QueryOptions } from 'mongoose';

const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({ userId: userId }).exec();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

const createUser = async (req: Request, res: Response) => {
  const { userId, name, email } = req.body;
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const dateJoined = `${month}/${day}/${year}`;
  const userInfo = {
    userId: userId,
    name: name,
    email: email,
    setupComplete: false,
    dateJoined: dateJoined,
    currentSpot: {},
    recentSpots: []
  };

  try {
    const newUser = new UserModel(userInfo);
    await newUser.save();
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.status(204).send("Could not create user");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

const setupPerformerInfo = async (req: Request, res: Response) => {
  const {
    userId,
    performerDescription,
    performanceStyles,
    instrumentTypes,
    audioTools,
    stagingAndVisuals,
    socialMediaHandles
  } = req.body;
  const query = { 'userId': userId };
  const update = {
    'setupComplete': true,
    'performerDescription': performerDescription, 
    'performanceStyles': performanceStyles,
    'instrumentTypes': instrumentTypes,
    'audioTools': audioTools,
    'stagingAndVisuals': stagingAndVisuals,
    'socialMediaHandles': socialMediaHandles
  };
  const options: QueryOptions = {
    returnDocument: "after",
    new: true,
    runValidators: true
  };
  
  try {
    const updatedUser = await UserModel.findOneAndUpdate(query, update, options);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).send("Not found.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
}

const updatePerformanceStyles = async (req: Request, res: Response) => {
  const { userId, performanceStyles } = req.body;
  const query = { 'userId': userId };
  const update = { 'performanceStyles': performanceStyles };
  const options: QueryOptions = {
    returnDocument: "after",
    new: true,
    runValidators: true
  };

  try {
    const updatedUser = await UserModel.findOneAndUpdate(query, update, options);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).send("Not found.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

const updateRecentSpots = async (req: Request, res: Response) => {
  const { userId, spotId, name, region } = req.body;
  const currentDate = new Date();
  const recentSpot = {
    spotId: spotId,
    name: name,
    region: region,
    dateAdded: currentDate
  };

  try {
    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      user.recentSpots.sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime());
      if (user.recentSpots.length >= 3) {
        user.recentSpots.shift();
      }
      user.recentSpots.push(recentSpot);
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export {
  getUser,
  createUser,
  setupPerformerInfo,
  updatePerformanceStyles,
  updateRecentSpots 
};