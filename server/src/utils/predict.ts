
interface Prediction {
  predictionKey: string,
  predictionValue: string
};

function sortPredictions(predictions: Prediction[]): Prediction[] {
  const order: { [key: string]: number } = {
    'High': 1,
    'Medium': 2,
    'Low': 3,
  };

  predictions.sort((a, b) => {
    const orderA = order[a.predictionValue] || 4;
    const orderB = order[b.predictionValue] || 4;
    return orderA - orderB;
  });

  return predictions;
}

export {
  sortPredictions
};