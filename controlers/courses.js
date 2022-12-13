const asyncHandler = require("../middelware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

const ErrorResponse = require("../utils/errorResponse");

exports.getCourses = asyncHandler(async (req, res, next) => {
  //     let query
  // if (req.params.bootcampId){
  //     query = Course.find({bootcamp: req.params.bootcampId})
  // }else{
  //     query = Course.find().populate({
  //         path: 'bootcamp',
  //         select: 'name description'
  // })
  // }

  //     const courses = await query
  // res.status(200).json({
  //   sucess:true,
  //   count: courses.length,
  //   data: courses
  // })
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: BootcampId });
    return res.status(200).json({
      sucess: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    next(new ErrorResponse(`No course with the id of ${req.params.id} `, 404));
  }
  res.status(200).json({
    sucess: true,
    data: course,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id:${req.params.bootcampId} doesn't exist`
      ),
      404
    );
  }

  if (req.user.id !== bootcamp.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User is not authorized to add a course to ${bootcamp.id}`
      ),
      401
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        `Course with id:${req.params.bootcampId} doesn't exist`
      ),
      404
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update this course`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        `Course with id:${req.params.bootcampId} doesn't exist`
      ),
      404
    );
  }
  console.log(course.user.toString());
  if (course.user.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to delete course`,
        401
      )
    );
  }

  await course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
