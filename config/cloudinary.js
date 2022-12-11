const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
 
const app = express();

cloudinary.config({
    cloud_name: "drjszu0so",
    api_key: 667185151279564,
    api_secret: 'Kr-WI0JfxHqOjOcEQCWH5KqQWSk',
  });
 
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "DEV",
    },
  });
  
 
  const upload = multer({ storage: storage });
  module.exports = upload
 
