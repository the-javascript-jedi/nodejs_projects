// path is a core node js module for dealing with file paths
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
// geocoder
const geocoder = require("../utils/geocoder");
// require the model
const Bootcamp = require("../models/Bootcamp");
// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
// we can access the hello object from the request set in the logger middleware
// we are using async and await because mongoose methods return a promise
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //since we are implementing this advancedResults middleware, we have access to the res.advancedResults response object which we created
  res.status(200).json(res.advancedResults);
});

// @desc    GET single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if we are providing an invalid bootcamp
  //since we are providing multiple res.status for success:true we need to provide return to first response else we will get an error that the headers are already set
  if (!bootcamp) {
    // return error if the bootcamp is not available in the db
    // return custom error message
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // console.log("req.body", req.body);

  // data will be saved to db
  const bootcamp = await Bootcamp.create(req.body);
  // res.status(200).json({ success: true, msg: "Create new bootcamp" });
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  //second argument -req.body-- what we want to insert
  //third argument -options object{}
  //-- new:true-data to be updated new true
  //--runValidators-runs the mongoose validators
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if bootcamp does not exist return a success:false message
  if (!bootcamp) {
    // return res.status(400).json({ success: false });
    // return error using next
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if bootcamp does not exist return a success:false message
  if (!bootcamp) {
    // return res.status(400).json({ success: false });
    // return error using next
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // remove the bootcamp
  bootcamp.remove();
  // return an empty object if data is deleted
  res.status(200).json({ success: true, data: {} });
});
// Calc radius using radians
// @route   GET/api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  //first argument -req.params.id-- take id from url
  const { zipcode, distance } = req.params;
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitute;
  // Calc radius using radians (radians is a unit of measurement for spheres)
  // Divide dist by radius of earth
  // Earth Radius = 3,663 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  //find the bootcamp
  //first argument -req.params.id-- take id from url
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if bootcamp does not exist return a success:false message
  if (!bootcamp) {
    // return error using next
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // check if any files have been uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  console.log(
    "controllers--bootcamp.js-bootcampPhotoUpload--req.files",
    req.files
  );
  const file = req.files.file;
  // Make sure the image is a photo
  // image alwasys starts with "image/" so if the mimetype does not start with image we can send aerror response
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // create custom file name so file won't be owerwritten if someone else also updates with same name
  // we can get the extension of the existing file name by using path.parse.(FileName).ext
  //we append the photo name with the bootcamp id with file extension alternatively we can also use the timestamp with file name
  // console.log("Date.now", Date.now());
  console.log("controllers--bootcamp.js--file.name", file.name);
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log("file.name", file.name);
  // upload the file
  // move the file to the upload path
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    // insert the photo to db and send back a response
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
