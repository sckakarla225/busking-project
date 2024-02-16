import { Request, Response } from 'express';
import { SpotModel } from '../models/spots';
import { UserModel } from '../models/user';

const getSpots = async (req: Request, res: Response) => {
  try {
    const spots = await SpotModel.find();
    if (spots.length !== 0) {
      res.status(200).json(spots);
    } else {
      res.status(404).send("Could not retrieve spots.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
};

const getCurrentSpot = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      const currentSpot = user.currentSpot;
      res.status(200).json(currentSpot);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
};

const reserveSpot = async (req: Request, res: Response) => {
  const { 
    userId, 
    spotId, 
    name, 
    region, 
    latitude, 
    longitude,
    reservedFrom,
    reservedTo 
  } = req.body;

  const currentSpot = {
    spotId: spotId,
    name: name,
    region: region,
    latitude: latitude,
    longitude: longitude,
    reservedFrom: reservedFrom,
    reservedTo: reservedTo,
  };
  const reservationId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  const reservationToAdd = {
    reservationId: reservationId,
    startTime: reservedFrom,
    endTime: reservedTo,
    performerId: userId,
  }

  try {
    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      user.currentSpot = currentSpot;
      const spot = await SpotModel.findOne({ spotId: spotId });
      if (spot) {
        spot.reservations.push(reservationToAdd);
        await spot.save();
      } else {
        res.status(404).send("Spot not found");
      }
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
};

const leaveSpot = async (req: Request, res: Response) => {
    const { userId, spotId, reservationId } = req.body;

    try {
      const user = await UserModel.findOne({ userId: userId });
      if (user) {
        user.currentSpot = { spotId: '', name: '', region: '' };
        const spot = await SpotModel.findOne({ spotId: spotId });
        if (spot) {
          const reservations = spot.reservations;
          const updatedReservations = reservations.filter(reservation => reservation.reservationId !== reservationId);
          spot.reservations = updatedReservations;
          await spot.save();
          res.status(200).send("Successfully left spot!");
        } else {
          res.status(404).send("Spot not found.");
        }
        await user.save();
      } else {
        res.status(404).send("User not found.");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send("Unknown error has occurred");
      }
    }
};

// TODO: Need to figure out spot graphics situation
const getSpotGraphics = async (req: Request, res: Response) => {
    res.status(200).send("Get Spot Graphics");
};

export {
  getSpots,
  getCurrentSpot,
  reserveSpot,
  leaveSpot,
  getSpotGraphics
};