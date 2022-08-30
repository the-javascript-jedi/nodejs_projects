const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
// bring the Course model
const Course = require("../models/Course");
// advancedResults middleware
const advancedResults = require("../middleware/advancedResults");
// initialize Router
// { mergeParams: true } is used to merging the url params from courses
const router = express.Router({ mergeParams: true });
// in our bootcamps route we are forwarding the request to courseRouter
//so for post request with id we can simply add a .post()
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);
module.exports = router;
