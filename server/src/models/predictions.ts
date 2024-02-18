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
    await Promise.all(predictionKeys.map(async (predictionKey: string) => {
      const value = await redis.get(predictionKey);
      if (value) {
        predictions.push({
          predictionKey: predictionKey,
          predictionValue: value,
        });
      } else {
        keysToBePredicted.push(predictionKey);
      }
    }));
    return { predictions, keysToBePredicted };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return null;
    } else {
      console.log("Unknown error.");
      return null;
    }
  }
};

export {
  addPrediction,
  getPrediction,
  getPredictions
};

