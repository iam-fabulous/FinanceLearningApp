// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController");
// const authMiddleware = require("../middleware/authMiddleware");

// // Authentication routes
// router.post("/auth/login", adminController.login);
// router.post("/auth/logout", authMiddleware, adminController.logout);

// // Topic management routes (protected)
// router.post("/topics", authMiddleware, adminController.createTopic);
// router.put("/topics/:id", authMiddleware, adminController.updateTopic);
// router.delete("/topics/:id", authMiddleware, adminController.deleteTopic);
// router.get("/topics/:id", authMiddleware, adminController.findTopicById);

// module.exports = router;
