const { restart } = require('nodemon');
const asyncHandler = require('../middelware/async')
const geocoder = require('../utils/GeoCoder')
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const path = require('path') // path.parse(file.name.ext)

exports.getBootcamp  = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({
      sucess:true,
      data: bootcamp
    })  
})

// @desc Get single bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access PUBLIC

exports.getBootcamps =asyncHandler(async (req, res,next) => {

// const reqQuery={...req.query}

// // copying req.query


// //  Making json out of my req.query 

//  //  parrsing my query back to js object
 
//  const removeFields =['select','sort','limit','page']
//  removeFields.forEach(param =>  delete reqQuery[param])

//  let queryStr = JSON.stringify(reqQuery)
//  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)


//  let query =  Bootcamp.find(JSON.parse(queryStr)).populate({path:'courses', select:'title'})

//  if(req.query.select){
//   const fields = req.query.select.split(',').join(' ')
//   query = query.select(fields)
//  }

//  if(req.query.sort){
//   const sortBy = req.query.sort.split(',').join(' ')
//   query = query.sort(sortBy)
//  }else{
//   query = query.sort('-createdAt')

//  }
//     const page = parseInt(req.query.page, 10) || 1
//     const limit = parseInt (req.query.limit,10)|| 25
//     const startIndex = (page -1 ) * limit
//     const endIndex = page * limit
//     const total = await Bootcamp.countDocuments()


//     query= query.skip(startIndex).limit(limit)

//     const bootcamps = await query

//     // Pagination result
//     const pagination = {}
//     if(endIndex < total){
//       pagination.next = {
//         page:page +1,
//         limit
//       }
//     }
   
//     if(startIndex > 0){
//       pagination.prev = {
//         page:page -1,
//         limit
//       }
//     }

    res.status(200).json(res.advancedResults)
})

// @desc Create single bootcamp
// @route  POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) =>{
  req.body.user = req.user.id

  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})

  if(publishedBootcamp && req.user.role !== "admin"){
    return next(new ErrorResponse(`The user with ${req.user.id} has allready published a bootcamp`))
  }
  const bootcamp= await Bootcamp.create(req.body)
  res.status(201).json(
    {
      sucess:true,
      data:bootcamp
    }
  )
})

// @desc Update single bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp =asyncHandler( async (req, res,next) => {
   let bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
      return  next(new ErrorResponse(`User ${req.params.id}: not authorized`,401))
    }
     bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})

    res.status(200).json({
      sucess:true,
      data:bootcamp
    })
});


// @desc DELETE single bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res,next) => {

 
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
      return  next(new ErrorResponse(`User ${req.params.id}: not authorized`,401))
    }
    bootcamp.remove()
    res.status(200).json({
      sucess:true,
      data:{}
    })
  
  

})


// Get bootcamps within a radius
// @route GET/api/v1/bootcamps/radius/:zipcode/:distance
exports.getBootcampsInRadius = asyncHandler(async (req, res,next) => {
  const{zipcode, distance} = req.params;
  // Get lat and long from geocoder
const loc = await geocoder.geocode(zipcode)
const lat = loc[0].latitude;
const long = loc[0].longitude;
//  Calc radius using radians
// Divide distance by radius of Earth
// Earth Radius = 6.378 km
const radius = distance / 6378
const bootcamps = await Bootcamp.find({
  location:{$geoWithin: { $centerSphere: [ [long, lat ], radius ] }}
})
res.status(200).json({
  sucess:true,
  count: bootcamps.length,
  data:bootcamps
})
})

// @desc Upload photo
// @route  put /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res,next) => {
 console.log(123)
  const bootcamp = await Bootcamp.findById(req.params.id)
  if(bootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
    return  next(new ErrorResponse(`User ${req.params.id}: not authorized`,401))
  }
 
  if(!bootcamp){
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
  }
  if(!req.files){
    return next(new ErrorResponse(`Please upload a file`,400))
  }


  const file = req.files.file
  // checking file type
  if(!file.mimetype.startsWith('image/')){
    return next(new ErrorResponse(`Please upload an image file`,400))
  }


  // checking file size
  if(!file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`,400))
  }
file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`
 console.log(file.name)

 file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) =>{
  if(err){
    console.log(err)
    return next(new ErrorResponse(`Problem with the upload`,500))
  }
 } )

 await Bootcamp.findByIdAndUpdate(req.params.id,{ photo : file.name})
  res.status(200).json({
    sucess:true,
    data:file.name
  })
// Create custom


})