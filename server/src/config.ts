import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI: string = process.env.DB_URI || "mongodb+srv://sckakarla36:Chinnari1674@busking-project.hpucowa.mongodb.net/?retryWrites=true&w=majority"

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
  connectToDatabase
};