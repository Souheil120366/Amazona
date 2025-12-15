import express from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoute.js';
import mapRouter from './routes/mapRoutes.js';
import cors from 'cors';

dotenv.config();

// Mongoose
mongoose.set('strictQuery', false);

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err.message));

// Express
const app = express();

// --- CORS ---
app.use(
  cors({
    origin: [
      "https://www.skftechnologies.com",
      "https://skftechnologies.com",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/upload', uploadRouter);
app.use('/api/map', mapRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Frontend static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// --- Server (HTTP only) ---
// Apache will proxy HTTPS → Node HTTP
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://127.0.0.1:5000");
});
