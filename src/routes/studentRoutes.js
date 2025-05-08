const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

// Enrollment route (public)
router.post("/enroll", studentController.enroll);

// Course routes (protected)
router.get(
  "/courses",
  authMiddleware("student"),
  studentController.getCourses
);
router.get(
  "/courses/:id/topics",
  authMiddleware("student"),
  studentController.getAvailableTopics
);
router.post(
  "/courses/:id/enroll",
  authMiddleware("student"),
  studentController.enrollInCourse
);

module.exports = router;
