//const express = require('express');
//const multer = require('multer');
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import dotenv from 'dotenv';
//const fs = require('fs');
//const Client = require('ssh2-sftp-client');

const uploadRouter = express.Router ();
dotenv.config();

// Configure Multer (Temporary storage before upload)
const upload = multer ({dest: '/tmp/'});
const VPS_IP = process.env.VPS_IP;
const VPS_USER_NAME = process.env.VPS_USER_NAME;
const VPS_PASSWORD = process.env.VPS_PASSWORD;

const VPS_UPLOAD_DIR = process.env.VPS_UPLOAD_DIR; // Adjust as needed
const VPS_CONFIG = {
  host: VPS_IP,
  port: 22,
  username: VPS_USER_NAME,
  password: VPS_PASSWORD,
};

// Upload API Endpoint
uploadRouter.post ('/', upload.single ('file'), async (req, res) => {
  if (!req.file) {
    return res.status (400).json ({error: 'No file uploaded'});
  }

  const sftp = new Client ();
  const localFilePath = req.file.path;
  const remoteFileName = req.file.originalname;
  const remoteFilePath = `${VPS_UPLOAD_DIR}/${remoteFileName}`;

  try {
    await sftp.connect (VPS_CONFIG);
    await sftp.put (localFilePath, remoteFilePath);
    await sftp.end ();

    fs.unlinkSync (localFilePath); // Remove local temp file

    const fileUrl = `https://www.skftechnologies.com/uploads/${remoteFileName}`;
    return res.json ({fileUrl});
  } catch (err) {
    console.error ('SFTP Upload Error:', err);
    return res.status (500).json ({error: 'Failed to upload file to VPS'});
  }
});

//module.exports = uploadRouter;
export default uploadRouter;
