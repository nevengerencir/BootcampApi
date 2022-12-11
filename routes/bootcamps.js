const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controlers/bootcamps');
const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middelware/advancedResult')
// const upload = require('../config/cloudinary') - multer


//Include other resource routers 
const courseRouter = require('./courses')

const router = express.Router();
//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)
router.route('/:id/photo').put(bootcampPhotoUpload)
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)
router.route("/").get(advancedResults(Bootcamp,'courses'),getBootcamps).post(createBootcamp);

router
  .route("/:id")
  // .post(upload.single('image'),(req,res) =>{
  //   return res.status(200).json({
  //     sucess:true,
  //     data: req.file.path
  // })}) if using multer - disable file uploader first
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

  module.exports = router;
