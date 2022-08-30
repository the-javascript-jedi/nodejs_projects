const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// require the model
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
//this method is used for two different routes
// @desc    GET courses
// @route-1   GET /api/v1/courses --route will get all courses
// @route-2   GET /api/v1/bootcamps/:bootcampId/courses--route will get all the specific courses for a specific bootcamp
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    //   @route-1
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    // we have a separate response because we won't use pagination when we search courses for a bootcamp, we display it only for all the courses
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    // @route-2
    res.status(200).json(res.advancedResults);
  }
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    GET  a single course
// @route   GET /api/v1/courses/:id --route will get single course based on the :id param
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  // we also need to show the bootcamp name and description so we use populate
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  // check if course exists
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});
//a course is always associated with a bootcamp id so we need the bootcamp id
// @desc  Add a course
// @route POST /api/v1/bootcamps/:bootcampId/courses -- the route path is same as route-1 in getCourses but we need to make a POST request
// @access  Private -- only logged in user can access their route
exports.addCourse = asyncHandler(async (req, res, next) => {
  // console.log("controller--addCourse-req.body", req.body);
  // submit this as a body fild because in our course model, bootcamp is an actual field
  // so we manually assign req.body.bootcamp from models/course.js to the param received so the id will be submitted in routes/courses.js
  req.body.bootcamp = req.params.bootcampId;
  //check if bootcamp exists
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  // console.log("controller--addCourse--bootcamp", bootcamp);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }
  // create course --
  //we are passing the req.body to create the course, the req.body contains anything sent from the body which will also include the bootcamp because we pulled it from the url and put it into req.body
  // console.log("addCourse--req.body", req.body);
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc  Update course
// @route PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`));
  }
  // findByIdAndUpdate takes id and what we need to update,
  //the options to be passed are the
  //new:true - returns new version of the course
  // runValidators:true
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc  Delete course
// @route DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  // for this scenario we will not use findByIdAndDelete as in later stage we will use a middleware to delete so for time being remove() is being used
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`));
  }
  // findByIdAndUpdate takes id and what we need to update,
  //the options to be passed are the
  //new:true - returns new version of the course
  // runValidators:true
  await course.remove();
  //for successful delete return an empty object
  res.status(200).json({
    success: true,
    data: {},
  });
});
