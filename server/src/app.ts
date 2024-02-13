import express from "express";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';

import { connectToDatabase } from "./config";
import { swaggerSpec } from './swagger';
import usersRouter from './routes/user';
import spotsRouter from './routes/spots';
import predictionsRouter from './routes/predictions';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', usersRouter);
app.use('/spots', spotsRouter);
app.use('/predictions', predictionsRouter);

connectToDatabase();

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});