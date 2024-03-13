import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const mongoURI: string = process.env.DB_URI || "mongodb+srv://sckakarla36:Chinnari1674@busking-project.hpucowa.mongodb.net/?retryWrites=true&w=majority"
const redisEndpoint: string = process.env.REDIS_ENDPOINT || "redis-18034.c284.us-east1-2.gce.cloud.redislabs.com:18034"
const redisPassword: string = process.env.REDIS_PASS || "603a2zbc0qQROFXHU66BjwNrzlFK4yXk";

let redis: Redis;
if (redisPassword !== "") {
  redis = new Redis(redisEndpoint, {
    password: redisPassword,
    connectionName: 'predictions',
    autoResubscribe: true
  });
  redis.on('connect', () => console.log('Connected to Redis!'));
  redis.on('error', (err) => console.error('Redis Client Error', err));
}

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit process with failure
  }
};

export {
  connectToDatabase,
  redis
};