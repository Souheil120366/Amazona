import express from 'express';
import multer from 'multer';
//import pkg from 'cloudinary';
import {v2 as cloudinary}  from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';

const upload = multer();

//const { v2 as cloudinary } = pkg;

const uploadRouter = express.Router();


uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            //reject(error);
            res.status(401).send({ message: 'Invalid Image Format' });
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    
    if (result) {
        res.send(result);
        
      } else {
        res.status(401).send({ message: 'Invalid Image Format' });
        
      }
  }
);
export default uploadRouter;