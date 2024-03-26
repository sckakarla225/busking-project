import { Schema, model, Document } from "mongoose";

interface CurrentSpot {
  spotId?: string;
  name?: string;
  region?: string;
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

interface SocialMediaHandle {
  platform: string;
  handle: string;
};

interface User extends Document {
  userId: string;
  name: string;
  email: string;
  setupComplete: boolean;
  dateJoined: string;
  performerDescription?: string;
  performanceStyles?: string[];
  instrumentTypes?: string[];
  audioTools?: string[];
  stagingAndVisuals?: string[];
  socialMediaHandles?: SocialMediaHandle[];
  totalPerformances?: number;
  avgPerformanceTime?: number;
  currentSpot: CurrentSpot;
  recentSpots: RecentSpot[];
}

const CurrentSpotSchema = new Schema<CurrentSpot>({
  spotId: { type: String, required: false },
  name: { type: String, required: false },
  region: { type: String, required: false },
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

const SocialMediaHandleSchema = new Schema<SocialMediaHandle>({
  platform: { type: String, required: true },
  handle: { type: String, required: true }
});

const UserSchema = new Schema<User>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  setupComplete: { type: Boolean, required: true },
  performanceStyles: [{ type: String, required: false }],
  performerDescription: { type: String, required: false },
  instrumentTypes: [{ type: String, required: false }],
  audioTools: [{ type: String, required: false }],
  stagingAndVisuals: [{ type: String, required: false }],
  socialMediaHandles: [{ type: SocialMediaHandleSchema, required: false }],
  dateJoined: { type: String, required: true },
  totalPerformances: { type: Number, required: false },
  avgPerformanceTime: { type: Number, required: false },
  currentSpot: { type: CurrentSpotSchema, required: true },
  recentSpots: [{ type: RecentSpotSchema, required: true }],
}, {
  collection: 'users'
});

export const UserModel = model<User>('User', UserSchema);