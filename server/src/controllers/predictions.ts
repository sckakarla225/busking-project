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

  try {
    const predictionsData = await getPredictions(predictionKeys);
    if (predictionsData) {
      const predictions = predictionsData.predictions;
      const predictionResults = await Promise.all(
        predictionsData.keysToBePredicted.map(async (predictionKey: string) => {
          // Get prediction value from ML model (store in predictionValue variable)
          const predictionValue: string = 'sample prediction';
          try {
            const predictionFromCache = await addPrediction(predictionKey, predictionValue);
            if (predictionFromCache) {
              predictions.push({
                predictionKey: predictionKey,
                predictionValue: predictionValue
              });
              return {
                predictionKey: predictionKey,
                predictionValue: predictionValue,
                success: true,
              };
            }
            return { success: false, predictionKey };
          } catch (error) {
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
      // Get prediction value from ML model (store in predictionValue variable)
      const predictionValue: string = 'sample prediction';
      const predictionFromCache = await addPrediction(predictionKey, predictionValue);
      if (predictionFromCache) {
        prediction = predictionFromCache;
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