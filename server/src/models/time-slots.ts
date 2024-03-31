import { Schema, model, Document } from "mongoose";

interface TimeSlot extends Document {
  timeSlotId: string,
  performerId?: string,
  spotId: string,
  spotName: string,
  spotRegion: string,
  date: string,
  startTime: Date,
  endTime: Date,
};

const TimeSlotSchema = new Schema<TimeSlot>({
  timeSlotId: { type: String, required: true, unique: true },
  performerId: { type: String, required: false },
  spotId: { type: String, required: true },
  spotName: { type: String, required: true },
  spotRegion: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
}, {
  collection: 'time-slots'
});

export const TimeSlotModel = model<TimeSlot>('TimeSlot', TimeSlotSchema);