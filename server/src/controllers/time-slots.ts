import { Request, Response } from 'express';
import { TimeSlotModel } from '../models/time-slots';
import { UserModel } from '../models/user';
import { createTimeFromString } from '../utils';

const createTimeSlots = async (req: Request, res: Response) => {
  const { timeSlots } = req.body;
  interface NewTimeSlot {
    id: string,
    spotId: string,
    spotName: string,
    spotRegion: string,
    date: string,
    startTime: string,
    endTime: string
  };

  try {
    const newTimeSlots: any[] = [];
    timeSlots.map(async (timeSlot: NewTimeSlot) => {
      const formattedStartTime = createTimeFromString(timeSlot.startTime);
      const formattedEndTime = createTimeFromString(timeSlot.endTime);
      const timeSlotToAdd = {
        timeSlotId: timeSlot.id,
        spotId: timeSlot.spotId,
        spotName: timeSlot.spotName,
        spotRegion: timeSlot.spotRegion,
        date: timeSlot.date,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      }
      const newTimeSlot = new TimeSlotModel(timeSlotToAdd);
      await newTimeSlot.save();
      newTimeSlots.push(newTimeSlot);
    });
    res.status(201).send(newTimeSlots);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
}

const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const timeSlots = await TimeSlotModel.find();
    if (timeSlots.length !== 0) {
      res.status(200).json(timeSlots);
    } else {
      res.status(404).send("Could not retrieve time slots.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
}

const reserveTimeSlot = async (req: Request, res: Response) => {
  const { timeSlotId, performerId } = req.body;

  try {
    const user = await UserModel.findOne({ userId: performerId });
    if (user) {
      const timeSlot = await TimeSlotModel.findOne({ timeSlotId: timeSlotId });
      if (timeSlot) {
        timeSlot.performerId = String(performerId);
        await timeSlot.save();
        res.status(201).send(timeSlot);
      } else {
        res.status(404).send("Time slot not found.");
      }
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
}

const freeTimeSlot = async (req: Request, res: Response) => {
  const { timeSlotId, performerId } = req.body;

  try {
    const user = await UserModel.findOne({ userId: performerId });
    if (user) {
      const timeSlot = await TimeSlotModel.findOne({ timeSlotId: timeSlotId });
      if (timeSlot) {
        timeSlot.performerId = undefined;
        await timeSlot.save();
        res.status(201).send(timeSlot);
      } else {
        res.status(404).send("Time slot not found.");
      }
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
}

export {
  createTimeSlots,
  getTimeSlots,
  reserveTimeSlot,
  freeTimeSlot
};