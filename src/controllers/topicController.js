const topicService = require("../services/topicService");
const quizService = require("../services/quizService");
const TopicRequestDto = require("../dtos/request/topicRequestDto");
const TopicResponseDto = require("../dtos/response/topicResponseDto");

class TopicController {
  async createTopic(req, res, next) {
    try {
      const requestDto = new TopicRequestDto(req.body);
      const topic = await topicService.createTopic(requestDto);
      res.status(201).json(new TopicResponseDto(topic));
    } catch (error) {
      next(error);
    }
  }

  async findTopicByTitle(req, res, next) {
    try {
      const topic = await topicService.findTopicByTitle(req.params.title);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.status(200).json(new TopicResponseDto(topic));
    } catch (error) {
      next(error);
    }
  }

  async findTopicById(req, res, next) {
    try {
      const topic = await topicService.findTopicById(req.params.Id);
      res.status(200).json(new TopicResponseDto(topic));
    } catch (error) {
      next(error);
    }
  }

  async updateTopic(req, res, next) {
    try {
      const requestDto = new TopicRequestDto(req.body);
      const topic = await topicService.updateTopic(req.params.Id, requestDto);
      res.status(200).json(new TopicResponseDto(topic));
    } catch (error) {
      next(error);
    }
  }

  async deleteTopic(req, res, next) {
    try {
      await topicService.deleteTopic(req.params.Id);
      res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async findAllTopics(req, res, next) {
    try {
      const topics = await topicService.findAllTopics();
      res.status(200).json(topics.map((topic) => new TopicsResponseDto(topic)));
    } catch (error) {
      next(error);
    }
  }

  async takeTopic(req, res, next) {
    try {
      const topic = await topicService.takeTopic(req.params.id, studentId);
      res.status(200).json({
        message: "Topic taken successfully",
        topic: new TopicResponseDto(topic),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TopicController();
