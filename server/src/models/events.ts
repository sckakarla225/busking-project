import { Schema, model, Document } from 'mongoose';

interface Event extends Document {
  date: string,
  name: string,
  venue: string,
  address: string,
  startTime: string,
  endTime: string,
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: [number];
  };
  details: string,
  tags: string[]
};

const EventSchema = new Schema<Event>({
  date: { type: String, required: true },
  name: { type: String, required: true },
  venue: { type: String, required: true },
  address: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  details: { type: String, required: true },
  tags: [{ type: String, required: true }]
}, {
  collection: 'events'
});

EventSchema.index({ 'location': '2dsphere' });

export const EventModel = model<Event>('Event', EventSchema);