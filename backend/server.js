import express from 'express';
import https from 'https';
//import http from 'http';
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

//var options = {
//  key: fs.readFileSync('/etc/sectigoSSl/skftechnologies.com.key'),
//  cert: fs.readFileSync('/etc/sectigoSSl/skftechnologies_com.crt'),
//  ca: fs.readFileSync('/etc/sectigoSSl/skftechnologies_com.ca-bundle')
//};

dotenv.config ();

// Set Mongoose strict query option to suppress deprecation warning
mongoose.set ('strictQuery', false);

// Ensure MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
  console.error ('Error: MONGODB_URI is not defined in .env file');
  process.exit (1);
}

mongoose
  .connect (process.env.MONGODB_URI)
  .then (() => {
    console.log ('connected to db');
  })
  .catch (err => {
    console.log (err.message);
  });

const app = express ();
const apiurl = process.env.APIURL;
const cors_options = {origin: apiurl};

app.use (cors (cors_options));

app.use (express.json ());
app.use (express.urlencoded ({extended: true}));
app.get ('/api/keys/paypal', (req, res) => {
  res.send (process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use ('/api/upload', uploadRouter);
app.use ('/api/map', mapRouter);
app.use ('/api/seed', seedRouter);
app.use ('/api/products', productRouter);
app.use ('/api/users', userRouter);
app.use ('/api/orders', orderRouter);

const __dirname = path.resolve ();
app.use (express.static (path.join (__dirname, '/frontend/build')));
app.get ('*', (req, res) =>
  res.sendFile (path.join (__dirname, '/frontend/build/index.html'))
);

app.use ((err, req, res, next) => {
  res.status (500).send ({message: err.message});
});

const port = process.env.PORT || 5000;

//https.createServer(options, app).listen(5000, console.log(`Server started on port 5000`));
app.listen (port, () => {
  console.log (`serve at http://localhost:${port}`);
});
