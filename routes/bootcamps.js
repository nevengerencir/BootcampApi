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
const upload = require('../config/cloudinary')


//Include other resource routers 
const courseRouter = require('./courses')

const router = express.Router();
//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)
router.route('/:id/photo').put(bootcampPhotoUpload)
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)
router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .post(upload.single('image'),(req,res) =>{
    return res.json({ picture: req.file.path })
  })
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

  module.exports = router;
