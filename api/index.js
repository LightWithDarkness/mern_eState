import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import  listingRoutes from './routes/listing.route.js'
import { errorHandler } from './utils/middlewares/error.handler.js';
import { fileURLToPath } from 'url';
import path from 'path';

config();
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/listing', listingRoutes);
//Middlewares
app.use(errorHandler);
// for deployment
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    app.listen(port, () => console.log(`API listening on port ${port}!`));
  } catch (error) {
    console.log(error);
  }
};

start();
