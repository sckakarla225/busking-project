import { Request, Response } from 'express';
import { addPrediction, getPrediction, getPredictions } from '../models/predictions';

const predictSpots = async (req: Request, res: Response) => {
  const { spotsToPredict } = req.body;
  const predictionKeys: string[] = [];

  for (const spot of spotsToPredict) {
    if (spot.spotId && spot.time && spot.date) {
      const predictionKey = `${spot.spotId}-${spot.date}-${spot.time}`;
      predictionKeys.push(predictionKey);
    }
  }

  const predictionsData = await getPredictions(predictionKeys);
  if (predictionsData) {
    const predictions = predictionsData.predictions;
    predictionsData.keysToBePredicted.map((predictionKey: string) => {
      // Get prediction value from ML model (store in predictionValue variable)
      const predictionValue: string = '';
      const newPrediction = {
        predictionKey: predictionKey,
        predictionValue: predictionValue
      };
      predictions.push(newPrediction);
    });
    res.status(200).json(predictions);
  } else {
    res.status(500).send("Error generating predictions");
  }
};

const predictSpot = async (req: Request, res: Response) => {
  const { spotId, time, date } = req.body;
  const predictionKey = `${spotId}-${date}-${time}`;
  let prediction = await getPrediction(predictionKey);
  
  if (!prediction) {
    // Get prediction value from ML model (store in predictionValue variable)
    const predictionValue: string = '';
    const predictionFromCache = await addPrediction(predictionKey, predictionValue);
    if (predictionFromCache) {
      prediction = predictionFromCache;
    }
  }

  if (prediction) {
    res.status(200).json(prediction);
  } else {
    res.status(500).send("Error generating prediction.");
  }
};

export {
  predictSpots,
  predictSpot
};