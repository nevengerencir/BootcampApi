const asyncHandler = require('../middelware/async')
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse')

exports.register = asyncHandler(async (req,res,next) =>{
res.status(200).json({sucess:true})
})