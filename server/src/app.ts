import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import { connectToDatabase } from "./config";
import { swaggerSpec } from './swagger';
import usersRouter from './routes/user';
import spotsRouter from './routes/spots';
import predictionsRouter from './routes/predictions';
import timeSlotsRouter from './routes/time-slots';
import weatherRouter from './routes/weather';
import eventsRouter from './routes/events';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', usersRouter);
app.use('/spots', spotsRouter);
app.use('/predictions', predictionsRouter);
app.use('/time-slots', timeSlotsRouter);
app.use('/weather', weatherRouter);
app.use('/events', eventsRouter);

app.post('/test', (req, res) => {
    res.status(200).send('POST request to the homepage');
});

connectToDatabase();

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };