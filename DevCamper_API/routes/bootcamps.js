const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
// get bootcamp model
const Bootcamp = require("../models/Bootcamp");
// use the advancedResults middleware for advanced search
const advancedResults = require("../middleware/advancedResults");
// Include other resource routers
//{{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses
const courseRouter = require("./courses");
// initialize Router
const router = express.Router();
// re-route into other resource routers--pass it on to the course router
//if this path is hit /:bootcampId/courses then getCourses route in courses.js is called
router.use("/:bootcampId/courses", courseRouter);

// router methods where id is not required
//we chain similar route functions here
// getting the bootcamps within a radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
// router for photo upload -- upload is a put request
router.route("/:id/photo").put(bootcampPhotoUpload);
// wherever we want to use the advancedResults middleware we need to pass it in with the method,
// we want to use advancedResults with getBootcamp -- it takes in the model and any populate
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);
// router methods where id is required
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
// export the router
module.exports = router;
