const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const authController = require("../controllers/authController");

// Authentication routes (public)
router.post("/auth/login", authController.login);
router.post("/auth/logout", authMiddleware, authController.logout);

// Admin routes (protected)
router.post("/courses", authMiddleware("admin"), adminController.createCourse);
router.put(
  "/courses/:id",
  authMiddleware("admin"),
  adminController.updateCourse
);
router.delete(
  "/courses/:id",
  authMiddleware("admin"),
  adminController.deleteCourse
);
router.get(
  "/courses/:id",
  authMiddleware("admin"),
  adminController.findCourseById
);
router.get(
  "/allCourses",
  authMiddleware("admin"),
  adminController.findAllCourses
);

router.post(
  "/courses/:courseId/topics",
  authMiddleware("admin"),
  adminController.createTopic
);
router.put("/topics/:id", authMiddleware("admin"), adminController.updateTopic);
router.delete(
  "/topics/:id",
  authMiddleware("admin"),
  adminController.deleteTopic
);

// Shared routes (admin and student access)
router.get(
  "/topics/:id",
  authMiddleware(["admin", "student"]),
  adminController.findTopicById
);
router.get(
  "/courses/:courseId/topics",
  authMiddleware(["admin", "student"]),
  adminController.findTopicsByCourse
);
module.exports = router;
