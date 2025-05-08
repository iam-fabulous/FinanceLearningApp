const AuthService = require("../services/authService");
const TopicService = require("../services/topicService");
const CourseService = require("../services/courseService");
const TopicRequestDto = require("../dtos/request/topicRequestDto");
const TopicResponseDto = require("../dtos/response/topicResponseDto");
const CourseRequestDto = require("../dtos/request/courseRequestDto");
const CourseResponseDto = require("../dtos/response/courseResponseDto");

class AdminController {
  // Authentication methods
  // async login(req, res, next) {
  //   try {
  //     const { email, password } = req.body;
  //     const result = await AuthService.login(email, password);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     if (
  //       error.message === "User not found" ||
  //       error.message === "Invalid credentials"
  //     ) {
  //       return res.status(401).json({ message: "Invalid credentials" });
  //     }

  //     if (error.message.includes("must be a non-empty string")) {
  //       return res.status(400).json({ message: error.message });
  //     }
  //     next(error);
  //   }
  // }

  // async logout(req, res, next) {
  //   try {
  //     const token = req.headers.authorization?.split(" ")[1];
  //     const result = await AuthService.logout(token);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // Course management methods
  async createCourse(req, res, next) {
    try {
      const requestDto = new CourseRequestDto(req.body);
      const course = await CourseService.createCourse(requestDto);
      res.status(201).json(new CourseResponseDto(course));
    } catch (error) {
      if (error.message === "Course with this title already exists") {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      const requestDto = new CourseRequestDto(req.body);
      const course = await CourseService.updateCourse(
        req.params.id,
        requestDto
      );
      res.status(200).json(new CourseResponseDto(course));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      if (error.message === "Course with this title already exists") {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      await CourseService.deleteCourse(req.params.id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      next(error);
    }
  }

  async findCourseById(req, res, next) {
    try {
      const course = await CourseService.findCourseById(req.params.id);
      res.status(200).json(new CourseResponseDto(course));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      next(error);
    }
  }

  async findAllCourses(req, res, next) {
    try {
      const courses = await CourseService.findAllCourses();
      res
        .status(200)
        .json(courses.map((course) => new CourseResponseDto(course)));
    } catch (error) {
      next(error);
    }
  }

  // Topic management methods
  async createTopic(req, res, next) {
    try {
      const requestDto = new TopicRequestDto(req.body);
      const topic = await TopicService.createTopic(
        req.params.courseId,
        requestDto
      );
      res.status(201).json(new TopicResponseDto(topic));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      if (error.message === "Topic with this title already exists") {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async findTopicById(req, res, next) {
    try {
      const topic = await TopicService.findTopicById(req.params.id);
      res.status(200).json(new TopicResponseDto(topic));
    } catch (error) {
      if (error.message === "Topic not found") {
        return res.status(404).json({ message: "Topic not found" });
      }
      next(error);
    }
  }

  async updateTopic(req, res, next) {
    try {
      const requestDto = new TopicRequestDto(req.body);
      const topic = await TopicService.updateTopic(req.params.id, requestDto);
      res.status(200).json(new TopicResponseDto(topic));
    } catch (error) {
      if (error.message === "Topic not found") {
        return res.status(404).json({ message: "Topic not found" });
      }
      if (error.message === "Topic with this title already exists") {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async deleteTopic(req, res, next) {
    try {
      await TopicService.deleteTopic(req.params.id);
      res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      if (error.message === "Topic not found") {
        return res.status(404).json({ message: "Topic not found" });
      }
      next(error);
    }
  }

  async findTopicsByCourse(req, res, next) {
    try {
      const topics = await TopicService.findTopicsByCourse(req.params.courseId);
      res.status(200).json(topics.map((topic) => new TopicResponseDto(topic)));
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({ message: "Course not found" });
      }
      next(error);
    }
  }
}

module.exports = new AdminController();
