const { restart } = require('nodemon');
const asyncHandler = require('../middelware/async')
const geocoder = require('../utils/GeoCoder')
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse')

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

const reqQuery={...req.query}

// copying req.query

 let queryStr = JSON.stringify(reqQuery)

//  Making json out of my req.query 
 queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

 //  parrsing my query back to js object
 
 const removeFields =['select','sort','limit','page']
 removeFields.forEach(param =>  delete reqQuery[param])

 let query =  Bootcamp.find(JSON.parse(queryStr)).populate({path:'courses', select:'title'})

 if(req.query.select){
  const fields = req.query.select.split(',').join(' ')
  query = query.select(fields)
 }

 if(req.query.sort){
  const sortBy = req.query.sort.split(',').join(' ')
  query = query.sort(sortBy)
 }else{
  query = query.sort('-createdAt')

 }
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt (req.query.limit,10)|| 25
    const startIndex = (page -1 ) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()


    query= query.skip(startIndex).limit(limit)

    const bootcamps = await query

    // Pagination result
    const pagination = {}
    if(endIndex < total){
      pagination.next = {
        page:page +1,
        limit
      }
    }
   
    if(startIndex > 0){
      pagination.prev = {
        page:page -1,
        limit
      }
    }

    res.status(200).json({
      sucess:true,
      data: bootcamps,
    count: bootcamps.length,
    pagination
    })
})

// @desc Create single bootcamp
// @route  POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) =>{const bootcamp= await Bootcamp.create(req.body)
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
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
    if(!bootcamp){
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
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
