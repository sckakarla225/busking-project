import { Schema, model, Document } from "mongoose";

interface CurrentSpot {
  spotId: string;
  name: string;
  region: string;
  latitude?: number;
  longitude?: number;
  reservedFrom?: Date;
  reservedTo?: Date;
}

interface RecentSpot {
  spotId: string;
  name: string;
  region: string;
  dateAdded: Date;
}

interface User extends Document {
  userId: string;
  name: string;
  email: string;
  performanceStyles: string[];
  dateJoined: string;
  totalPerformances?: number;
  avgPerformanceTime?: number;
  currentSpot: CurrentSpot;
  recentSpots: RecentSpot[];
}

const CurrentSpotSchema = new Schema<CurrentSpot>({
  spotId: { type: String, required: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  reservedFrom: { type: Date, required: false },
  reservedTo: { type: Date, required: false },
});

const RecentSpotSchema = new Schema<RecentSpot>({
  spotId: { type: String, required: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  dateAdded: { type: Date, required: true }
});

const UserSchema = new Schema<User>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  performanceStyles: [{ type: String }],
  dateJoined: { type: String, required: true },
  totalPerformances: { type: Number, required: false },
  avgPerformanceTime: { type: Number, required: false },
  currentSpot: { type: CurrentSpotSchema, required: true },
  recentSpots: [{ type: RecentSpotSchema, required: true }],
}, {
  collection: 'users'
});

export const UserModel = model<User>('User', UserSchema);