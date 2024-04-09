import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { TimeSlotModel } from '../models/time-slots';
import { UserModel } from '../models/user'
import { SpotModel } from '../models/spots';
import { getPredictions } from '../models/predictions';
import { 
  createTimeFromString, 
  getDayOfWeek, 
  sortPredictions,
  getNextHour,
  reformatDateString 
} from '../utils';

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
};

const generateTimeSlots = async (req: Request, res: Response) => {
  const { date } = req.body;
  const times = [
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
  ];

  try {
    const spots = await SpotModel.find();
    if (spots.length === 0) {
      return res.status(404).send("Could not retrieve the spots");
    }

    const dayOfWeek = getDayOfWeek(date);
    const predictionsTasks = spots.map(async (spot: any) => {
      const predictionKeys = times.map((time: string) => `${spot.spotId}||${spot.latitude}||${spot.longitude}||${time}||${date}||${dayOfWeek}`);
      const predictionsData = await getPredictions(predictionKeys);
      if (!predictionsData) {
        throw new Error("Error generating predictions");
      }

      const predictions = predictionsData.predictions;
      if (predictions.length === 0) {
        throw new Error("No predictions found");
      }

      const sortedPredictions = sortPredictions(predictions);
      return sortedPredictions.slice(0, 3).map(async (prediction) => {
        const parts = prediction.predictionKey.split('||');
        const startTimeStr = parts[3];
        const endTimeStr = getNextHour(startTimeStr);
        const formattedStartTime = createTimeFromString(startTimeStr);
        const formattedEndTime = createTimeFromString(endTimeStr);
        const formattedDate = reformatDateString(date);
        const timeSlotId = uuidv4();
        const timeSlotToAdd = {
          timeSlotId: timeSlotId,
          spotId: spot.spotId,
          spotName: spot.name,
          spotRegion: spot.region,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        }
        const newTimeSlot = new TimeSlotModel(timeSlotToAdd);
        await newTimeSlot.save();

        return {
          id: timeSlotId,
          spotId: spot.spotId,
          spotName: spot.name,
          spotRegion: spot.region,
          date: formattedDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
        };
      });
    });

    const generatedTimeSlots = (await Promise.all(predictionsTasks)).flat();
    res.status(200).send(generatedTimeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : "Unknown error has occurred");
  }
};

export {
  createTimeSlots,
  getTimeSlots,
  reserveTimeSlot,
  freeTimeSlot,
  generateTimeSlots
};