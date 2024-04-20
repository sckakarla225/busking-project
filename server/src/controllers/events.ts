import { Request, Response } from 'express';
import { EventModel } from '../models/events';
import { promises as fs } from 'fs';
import path from 'path';

const createEvents = async (req: Request, res: Response) => {
  interface NewEvent {
    date: string,
    name: string,
    venue: string,
    address: string,
    startTime: string,
    endTime: string,
    latitude: number,
    longitude: number,
    details: string,
    tags: string[]
  };

  try {
    const filePath = path.join(__dirname, 'data', 'events.json');
    const data = await fs.readFile(filePath, 'utf8');
    const events = JSON.parse(data);
    const uploadedEvents: any[] = [];
    
    events.map(async (eventInfo: NewEvent) => {
      const eventToAdd = {
        date: eventInfo.date,
        name: eventInfo.name,
        venue: eventInfo.venue,
        address: eventInfo.address,
        startTime: eventInfo.startTime,
        endTime: eventInfo.endTime,
        location: {
          type: 'Point',
          coordinates: [eventInfo.longitude, eventInfo.latitude]
        },
        details: eventInfo.details,
        tags: eventInfo.tags
      };
      const newEvent = new EventModel(eventToAdd);
      await newEvent.save();
      uploadedEvents.push(newEvent);
    });
    res.status(201).send(uploadedEvents);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    };
  }
}

const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find();
    if (events.length !== 0) {
      res.status(200).json(events);
    } else {
      res.status(404).send("Could not retrieve events.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
};

const getNearbyEvents = async (req: Request, res: Response) => {
  const { date, latitude, longitude } = req.body;

  try {
    const latitudeParsed = Number(latitude);
    const longitudeParsed = Number(longitude);
    if (isNaN(latitudeParsed) || isNaN(longitudeParsed)) {
      return res.status(400).send("Invalid latitude or longitude.");
    }

    const events = await EventModel.find({
      date: date,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitudeParsed, latitudeParsed]
          },
          $maxDistance: 100
        }
      }
    });

    if (events.length !== 0) {
      res.json(events);
    } else {
      res.status(404).send("No nearby events found.");
    }    
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred");
    }
  }
};

export {
  createEvents,
  getEvents,
  getNearbyEvents
};