import { Request, Response } from 'express';
import axios from 'axios';
import { addPrediction, getPrediction, getPredictions } from '../models/predictions';

const HEADERS = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const predictSpots = async (req: Request, res: Response) => {
  const { spotsToPredict } = req.body;
  const predictionKeys: string[] = [];

  for (const spot of spotsToPredict) {
    if (
      spot.spotId && 
      spot.time && 
      spot.date &&
      spot.latitude &&
      spot.longitude &&
      spot.day
    ) {
      const predictionKey = `
        ${spot.spotId}-
        ${spot.latitude}-
        ${spot.longitude}-
        ${spot.date}-
        ${spot.day}-
        ${spot.time}
      `;
      predictionKeys.push(predictionKey);
    }
  }

  try {
    const predictionsData = await getPredictions(predictionKeys);
    if (predictionsData) {
      const predictions = predictionsData.predictions;
      const predictionResults = await Promise.all(
        predictionsData.keysToBePredicted.map(async (predictionKey: string) => {
          const parts = predictionKey.trim().split('-').map(part => part.trim());
          const [spotId, latitude, longitude, date, day, time] = parts;
          const predictionInput = {
            spot_id: spotId,
            latitude: latitude,
            longitude: longitude,
            time: time,
            date: date,
            day: day
          };

          try {
            const response = await axios.post(
              'http://localhost:8000/predictions/predict-spot',
              predictionInput,
              HEADERS
            );
            const { prediction_value } = response.data;
            const predictionFromCache = await addPrediction(predictionKey, prediction_value);
            if (predictionFromCache) {
              predictions.push({
                predictionKey: predictionKey,
                predictionValue: prediction_value
              });
              return {
                predictionKey: predictionKey,
                predictionValue: prediction_value,
                success: true,
              };
            }
            return { success: false, predictionKey };
          } catch (apiError: any) {
            if (apiError.response) {
              res.status(apiError.response.status).send("Unknown error has occurred");
            } else if (apiError.request) {
              res.status(204).send("Error generating prediction");
            } else {
              res.status(500).send("Invalid request.");
            }
            return { success: false, predictionKey };
          }
        })
      );
    
      const allSuccessful = predictionResults.every(result => result.success);
      if (allSuccessful) {
        res.status(200).json(predictions);
      } else {
        const failedPredictions = predictionResults
          .filter(result => !result.success)
          .map(result => result.predictionKey);
        res.status(204).send(`Could not process predictions for keys: ${failedPredictions.join(', ')}`);
      }
    } else {
      res.status(404).send("Error generating predictions");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred.");
    }
  }
};

const predictSpot = async (req: Request, res: Response) => {
  const { spotId, latitude, longitude, time, date, day } = req.body;
  const predictionKey = `${spotId}-${date}-${time}`;

  try {
    let prediction = await getPrediction(predictionKey);
    if (!prediction) {
      const predictionInput = {
        spot_id: spotId,
        latitude: latitude,
        longitude: longitude,
        time: time,
        date: date,
        day: day
      };

      try {
        const response = await axios.post(
          'http://localhost:8000/predictions/predict-spot',
          predictionInput,
          HEADERS
        );
        const { prediction_value } = response.data;
        const predictionFromCache = await addPrediction(predictionKey, prediction_value);
        if (predictionFromCache) {
          prediction = predictionFromCache;
        }
      } catch (apiError: any) {
        if (apiError.response) {
          res.status(apiError.response.status).send("Unknown error has occurred");
        } else if (apiError.request) {
          res.status(204).send("Error generating prediction");
        } else {
          res.status(500).send("Invalid request.");
        }
      }
    }
  
    if (prediction) {
      res.status(200).json(prediction);
    } else {
      res.status(204).send("Error generating prediction.");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error has occurred.");
    }
  }
  
};

export {
  predictSpots,
  predictSpot
};