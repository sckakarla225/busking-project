import { Schema, model, Document } from "mongoose";

// User Model Schema

interface CurrentSpot {
  spotId: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  reservedFrom: string;
  reservedTo: string;
}

interface RecentSpot {
  spotId: string;
  name: string;
  region: string;
}

interface User extends Document {
  userId: string;
  name: string;
  email: string;
  performanceStyles: string[];
  dateJoined: string;
  totalPerformances: number;
  avgPerformanceTime: number;
  currentSpot: CurrentSpot;
  recentSpots: RecentSpot[];
}

const CurrentSpotSchema = new Schema<CurrentSpot>({
  spotId: { type: String, required: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  reservedFrom: { type: String, required: true },
  reservedTo: { type: String, required: true },
});

const RecentSpotSchema = new Schema<RecentSpot>({
  spotId: { type: String, required: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
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

// User Model Actions