const router = require("express").Router();

const materialRoute = require('./materialRoute');
const {
  createCourseValidator,
  getCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
} = require("../utils/validators/courseValidators");

const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
  resizeImage,
} = require("../controllers/courseController");

router.use("/:courseId/materials", materialRoute);

router
  .route("/")
  .get(getCourses)
  .post(uploadCourseImage, resizeImage, createCourseValidator, createCourse);

router
  .route("/:id")
  .get(getCourseValidator, getCourse)
  .put(uploadCourseImage, resizeImage, updateCourseValidator, updateCourse)
  .delete(deleteCourseValidator, deleteCourse);

module.exports = router;
