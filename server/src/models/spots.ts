import { Schema, model, Document } from 'mongoose';

// Spot Model Schema

interface Reservation {
  startTime: string;
  endTime: string;
  performerId: string;
}

interface Spot extends Document {
  spotId: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  spotSize: number;
  reservations: Reservation[];
}

const ReservationSchema = new Schema<Reservation>({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  performerId: { type: String, required: true },
});

const SpotSchema = new Schema<Spot>({
  spotId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  region: { type: String, required: true },
  spotSize: { type: Number, required: true },
  reservations: [ReservationSchema],
}, {
  collection: 'spots'
});

export const SpotModel = model<Spot>('Spot', SpotSchema);

// Spot Model Actions


