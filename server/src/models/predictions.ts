import { redis } from '../config';

interface Prediction {
  predictionKey: string,
  predictionValue: string
};

const addPrediction = async (predictionKey: string, predictionValue: string) => {
  try {
    await redis.set(predictionKey, predictionValue);
    const value = await redis.get(predictionKey);
    if (value) {
      return value;
    } else {
      return null
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return null;
    }
  }
};

const getPrediction = async (predictionKey: string) => {
  try {
    const value = await redis.get(predictionKey);
    if (value) {
      return value;
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return null;
    }
  }
};

const getPredictions = async (predictionKeys: string[]) => {
  const predictions: Prediction[] = [];
  const keysToBePredicted: string[] = [];

  try {
    predictionKeys.map(async (predictionKey: string) => {
      const value = await redis.get(predictionKey);
      if (value) {
        const prediction: Prediction = {
          predictionKey: predictionKey,
          predictionValue: value,
        };
        predictions.push(prediction);
      } else {
        keysToBePredicted.push(predictionKey);
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return null;
    }
  }

  return { predictions, keysToBePredicted };
};

export {
  addPrediction,
  getPrediction,
  getPredictions
};

