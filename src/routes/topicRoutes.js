const express = require("express");
const TopicController = require("../controllers/topicController");
const authMiddleware = require("../middlewares/authMiddleware");
const topicController = require("../controllers/topicController");

const router = express.Router();

router.post("/topics", authMiddleware, TopicController.createTopic);
router.get("/topics/:title", authMiddleware, TopicController.findTopicByTitle);
router.get("/topics/:id", authMiddleware, TopicController.findTopicById);
router.put("/topics:id", authMiddleware, topicController.updateTopic);
router.delete("/topics/:id", authMiddleware, TopicController.deleteTopic);
router.get("/topics", TopicController.findAllTopics);
router.post("/topics/:id/take", TopicController.takeTopic);

module.exports = router;
