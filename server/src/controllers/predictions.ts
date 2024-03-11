import { Request, Response } from 'express';
import axios from 'axios';
import { addPrediction, getPrediction, getPredictions } from '../models/predictions';

interface PredictionInput {
  spot_id: string,
  latitude: number,
  longitude: number,
  time: string,
  date: string,
  day: string
};

const HEADERS = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const predictSpots = async (req: Request, res: Response) => {
  const { spotsToPredict } = req.body;
  let arraySpotsToPredict: any[];
  if (!Array.isArray(spotsToPredict)) {
    if (typeof spotsToPredict === 'object' && spotsToPredict !== null) {
      arraySpotsToPredict = [spotsToPredict];
    } else {
      return res.status(400).send('Invalid input');
    }
  } else {
    arraySpotsToPredict = spotsToPredict;
  }

  const predictionKeys: string[] = [];
  for (const spot of arraySpotsToPredict) {
    if (
      spot.spotId && 
      spot.time && 
      spot.date &&
      spot.latitude &&
      spot.longitude &&
      spot.day
    ) {
      const predictionKey = `${spot.spotId}||${spot.latitude}||${spot.longitude}||${spot.time}||${spot.date}||${spot.day}`;
      predictionKeys.push(predictionKey);
    }
  }

  try {
    const predictionsData = await getPredictions(predictionKeys);
    if (predictionsData) {
      const predictions = predictionsData.predictions;
      const predictionResults = await Promise.all(
        predictionsData.keysToBePredicted.map(async (predictionKey: string) => {
          const parts = predictionKey.trim().split('||').map(part => part.trim());
          const [spotId, latitude, longitude, time, date, day] = parts;
          const predictionInput: PredictionInput = {
            spot_id: spotId,
            latitude: Number(latitude),
            longitude: Number(longitude),
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
            // console.log(prediction_value);
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
            return { 
              success: false, 
              predictionKey,
              error: apiError.response ? apiError.response.status : "Failed to connect or process the prediction" 
            };
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
  const predictionKey = `${spotId}||${latitude}||${longitude}||${time}||${date}||${day}`;

  try {
    let prediction = await getPrediction(predictionKey);
    if (!prediction) {
      const predictionInput: PredictionInput = {
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
        prediction = null;
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