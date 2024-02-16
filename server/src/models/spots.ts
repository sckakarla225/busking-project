import { Schema, model, Document } from 'mongoose';

interface Reservation {
  reservationId: string;
  startTime: Date;
  endTime: Date;
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
  reservationId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
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


