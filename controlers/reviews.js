const asyncHandler = require("../middelware/async");
const User = require("../models/User");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");

const ErrorResponse = require("../utils/errorResponse");

//  @desc Get all reviews
//  @route GET /api/v1/users
//  @access Private/Admin
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      sucess: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//  @desc Get single review
//  @route GET /api/v1/reviews/:id
//  @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    next(new ErrorResponse("Review not found", 404));
  }
  res.status(200).json({
    sucess: true,
    data: review,
  });
});

//  @desc Create a review
//  @route POST /api/v1/bootcamps/:bootcampId/reviews
//  @access Private

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const review = await Review.create(req.body);
  if (!review) {
    next(new ErrorResponse("Review not found", 404));
  }
  res.status(201).json({
    sucess: true,
    data: review,
  });
});

//  @desc Delete a review
//  @route DELETE /api/v1/reviews/:id
//  @access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    next(new ErrorResponse("Review not found", 404));
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    next(new ErrorResponse("Not authorized to delete Review", 401));
  }
  review = await Review.findByIdAndRemove(req.params.id);
  res.status(200).json({
    sucess: true,
    data: {},
  });
});

//  @desc Update
//  @route PUT /api/v1/reviews/:id
//  @access Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    next(new ErrorResponse("Review not found", 404));
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    next(new ErrorResponse("Not authorized to update Review", 401));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    sucess: true,
    data: review,
  });
});
