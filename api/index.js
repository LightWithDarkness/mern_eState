import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import { errorHandler } from './utils/middlewares/error.handler.js';

config();
const app = express();
const port = 3000;


app.use(express.json())
app.use(cookieParser())
//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user',userRoutes)
//Middlewares
app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    app.listen(port, () => console.log(`API listening on port ${port}!`));
  } catch (error) {
    console.log(error);
  }
};

start();
